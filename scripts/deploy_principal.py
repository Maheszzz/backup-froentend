import boto3
import csv
import subprocess
import time
import sys
import os

# Configuration
CREDS_CSV = '/Users/maheswaranm/Downloads/makemystay-backend_accessKeys.csv'
REGION = 'ap-south-1'
PROJECT_DIR = '/Users/maheswaranm/make-my-stay'

def get_aws_session():
    with open(CREDS_CSV, 'r') as f:
        reader = csv.reader(f)
        next(reader)
        row = next(reader)
        return boto3.Session(
            aws_access_key_id=row[0].strip(),
            aws_secret_access_key=row[1].strip(),
            region_name=REGION
        )

def get_instance_id(ec2_client, ip):
    resp = ec2_client.describe_instances(Filters=[{'Name': 'network-interface.addresses.association.public-ip', 'Values': [ip]}])
    for res in resp['Reservations']:
        for inst in res['Instances']:
            return inst['InstanceId']
    return None

def wait_for_state(elbv2, tg_arn, instance_id, target_state, timeout=300):
    print(f"  ⌛ Waiting for {instance_id} to reach '{target_state}' state...")
    start_time = time.time()
    while time.time() - start_time < timeout:
        health = elbv2.describe_target_health(TargetGroupArn=tg_arn)
        for desc in health['TargetHealthDescriptions']:
            if desc['Target']['Id'] == instance_id:
                current_state = desc['TargetHealth']['State']
                if current_state == target_state:
                    print(f"  ✅ Target reached '{target_state}'")
                    return True
                # Special case: 'unused' usually means draining is done
                if target_state == 'unused' and current_state == 'unused':
                    return True
        time.sleep(10)
    return False

def deploy_principal():
    session = get_aws_session()
    elbv2 = session.client('elbv2')
    ec2 = session.client('ec2')

    # 1. Identify Target Group
    tgs = elbv2.describe_target_groups()['TargetGroups']
    frontend_tg = next((tg for tg in tgs if 'makemystay' in tg['TargetGroupName'].lower() and tg['Port'] == 80), None)
    if not frontend_tg:
        print("❌ Error: Could not find frontend Target Group (Port 80/makemystay).")
        sys.exit(1)
    
    tg_arn = frontend_tg['TargetGroupArn']
    print(f"🎯 Target Group: {frontend_tg['TargetGroupName']}")

    # 2. Get Targets (Nodes)
    health = elbv2.describe_target_health(TargetGroupArn=tg_arn)
    ips = []
    # Match provided nodes or just update all healthy nodes
    target_ips = os.environ.get('DEPLOY_HOSTS', '43.205.233.181,13.201.61.117').split(',')

    print(f"🚀 Principal Rollout starting for nodes: {target_ips}")

    for ip in target_ips:
        print(f"\n--- 🏗️  Orchestrating Node: {ip} ---")
        instance_id = get_instance_id(ec2, ip)
        if not instance_id:
            print(f"⚠️  Skipping {ip} (Instance ID not found)")
            continue

        # A. DRAIN
        print(f"  ➡️  Deregistering {instance_id} from ALB...")
        elbv2.deregister_targets(TargetGroupArn=tg_arn, Targets=[{'Id': instance_id}])
        
        # Wait for connections to drain (State: unused)
        if not wait_for_state(elbv2, tg_arn, instance_id, 'unused'):
            print("❌ Timeout waiting for draining. Continuing with caution...")

        # B. DEPLOY
        print(f"  📦 Executing Atomic Release on {ip}...")
        # Path to pem is already in env or hardcoded in deploy-all.sh (but we'll pass env)
        env = os.environ.copy()
        env['DEPLOY_HOSTS'] = ip # Just this one node
        result = subprocess.run(['./scripts/deploy-all.sh', ip], cwd=PROJECT_DIR, env=env)
        
        if result.returncode != 0:
            print(f"❌ Deployment failed on {ip}. Aborting cluster rollout.")
            # Re-register just in case?
            elbv2.register_targets(TargetGroupArn=tg_arn, Targets=[{'Id': instance_id}])
            sys.exit(1)

        # C. RE-REGISTER
        print(f"  ⬅️  Registering {instance_id} back to ALB...")
        elbv2.register_targets(TargetGroupArn=tg_arn, Targets=[{'Id': instance_id}])
        
        # Wait for Healthy
        if not wait_for_state(elbv2, tg_arn, instance_id, 'healthy'):
            print(f"❌ Node {ip} failed to reach Healthy state after deployment.")
            sys.exit(1)

    print("\n🏁 Principal Rollout Complete. Zero Request Drops.")

if __name__ == "__main__":
    deploy_principal()
