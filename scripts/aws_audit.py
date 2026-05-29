import boto3
import sys

def audit_alb():
    print("🔍 Auditing AWS Application Load Balancer Configuration...")
    
    # Initialize boto3 clients
    try:
        elbv2 = boto3.client('elbv2', region_name='ap-south-1')
        ec2 = boto3.client('ec2', region_name='ap-south-1')
    except Exception as e:
        print(f"❌ Failed to initialize AWS clients: {e}")
        sys.exit(1)

    # 1. Find relevant Target Groups
    try:
        tgs = elbv2.describe_target_groups()['TargetGroups']
    except Exception as e:
        print(f"❌ Failed to fetch Target Groups: {e}")
        sys.exit(1)

    found_tg = None
    for tg in tgs:
        # Looking for the frontend target group
        if 'makemystay' in tg['TargetGroupName'].lower() and tg['TargetType'] == 'instance':
            found_tg = tg
            break

    if not found_tg:
        print("⚠️  No clear frontend Target Group found from naming convention.")
        return

    tg_arn = found_tg['TargetGroupArn']
    tg_name = found_tg['TargetGroupName']
    health_path = found_tg.get('HealthCheckPath', 'N/A')

    print(f"✅ Target Group Found: {tg_name}")
    print(f"  - Health Check Path: {health_path}")

    # Verify if it's using our new /health.json
    if health_path != '/health.json':
        print(f"❌ CRITICAL: Target Group is using '{health_path}' instead of '/health.json'.")
        print("👉 Action: Update Target Group configuration in AWS Console to use '/health.json'.")
    else:
        print("✅ Health Check Path is correctly synchronized.")

    # 3. Check Deregistration Delay (Drain Delay)
    try:
        attrs = elbv2.describe_target_group_attributes(TargetGroupArn=tg_arn)['Attributes']
        drain_delay = next(a['Value'] for a in attrs if a['Key'] == 'deregistration_delay.timeout_seconds')
        print(f"\n⚙️  Deregistration Delay (Draining): {drain_delay}s")
        if int(drain_delay) > 60:
            print("⚠️  Warning: Delay is > 60s. This will slow down your deployments.")
            print("👉 Recommendation: Reduce to 30-60s in AWS Console for faster Principal rollouts.")
        else:
            print("✅ Draining delay is optimized for fast deployments.")
    except Exception as e:
        print(f"❌ Failed to fetch Target Group attributes: {e}")

    # 4. Check Target Health
    print("\n--- Target Health Status ---")
    try:
        health = elbv2.describe_target_health(TargetGroupArn=tg_arn)
        for target in health['TargetHealthDescriptions']:
            t_id = target['Target']['Id']
            t_state = target['TargetHealth']['State']
            t_reason = target['TargetHealth'].get('Reason', 'Healthy')
            print(f"  - Instance {t_id}: {t_state} (Reason: {t_reason})")
    except Exception as e:
        print(f"❌ Failed to fetch target health: {e}")

if __name__ == "__main__":
    audit_alb()
