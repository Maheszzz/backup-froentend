import { useState, useEffect } from "react";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: string;
  amount: number;
  receiptUrl: string;
}

export function PaymentSuccessModal({ isOpen, onClose, paymentId, amount, receiptUrl }: PaymentSuccessModalProps) {

  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const [checkVisible, setCheckVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 50);
      setTimeout(() => setCheckVisible(true), 300);
      setTimeout(() => setContentVisible(true), 600);
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .overlay {
          position: fixed; inset: 0; z-index: 100;
          display: flex; align-items: center; justify-content: center; padding: 1rem;
          background: rgba(8, 8, 9, 0.85);
          backdrop-filter: blur(16px);
          opacity: 0; transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .overlay.show { opacity: 1; }

        .modal {
          background: #0d0d0e;
          border: 1px solid rgba(197, 160, 33, 0.18);
          border-radius: 32px;
          width: 100%; max-width: 440px;
          overflow: hidden; position: relative;
          transform: translateY(24px) scale(0.97);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow:
            0 0 0 1px rgba(197, 160, 33, 0.05),
            0 30px 90px rgba(0,0,0,0.85),
            0 0 60px rgba(197, 160, 33, 0.04);
        }
        .modal.show { transform: translateY(0) scale(1); }

        /* Noise texture */
        .modal::before {
          content: '';
          position: absolute; inset: 0; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          background-size: 128px 128px; pointer-events: none; opacity: 0.5;
          border-radius: inherit;
        }

        /* Top gold accent line */
        .modal::after {
          content: '';
          position: absolute; top: 0; left: 10%; right: 10%; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(197,160,33,0.7), rgba(197,160,33,0.3), transparent);
          z-index: 2;
        }

        .content { position: relative; z-index: 1; padding: 3rem 2.5rem 2.5rem; }

        /* Check animation */
        .check-wrap {
          display: flex; justify-content: center; margin-bottom: 2rem;
          opacity: 0; transform: scale(0.4) rotate(-15deg);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .check-wrap.show { opacity: 1; transform: scale(1) rotate(0deg); }

        .check-outer {
          position: relative; width: 84px; height: 84px;
        }
        .check-ring {
          position: absolute; inset: -8px;
          border: 1px solid rgba(197,160,33,0.25);
          border-radius: 50%;
          animation: ring-pulse 3s ease-in-out infinite;
        }
        .check-ring-2 {
          position: absolute; inset: -16px;
          border: 1px solid rgba(197,160,33,0.1);
          border-radius: 50%;
          animation: ring-pulse 3s ease-in-out infinite 0.5s;
        }
        @keyframes ring-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.06); opacity: 0.4; }
        }
        .check-bg {
          width: 84px; height: 84px;
          background: linear-gradient(135deg, #a6811c, #c5a021);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 1px rgba(197,160,33,0.4), 0 8px 30px rgba(197,160,33,0.3);
          position: relative;
        }
        .check-bg::after {
          content: '';
          position: absolute; inset: 2px;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
          border-radius: 50%;
        }

        /* Floating gold sparks */
        .spark {
          position: absolute; width: 4px; height: 4px;
          background: #c5a021; border-radius: 50%;
          animation: spark-float 3s ease-in-out infinite;
        }
        .spark:nth-child(1) { top: -6px; right: 6px; animation-delay: 0s; }
        .spark:nth-child(2) { top: 10px; right: -12px; animation-delay: 0.6s; width: 3px; height: 3px; background: #e5c043; }
        .spark:nth-child(3) { bottom: 2px; right: -6px; animation-delay: 1.2s; width: 2px; height: 2px; }
        @keyframes spark-float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
          50% { transform: translateY(-8px) scale(1.3); opacity: 0.3; }
        }

        .text-area {
          text-align: center; margin-bottom: 2.25rem;
          opacity: 0; transform: translateY(16px);
          transition: all 0.5s ease 0.1s;
        }
        .text-area.show { opacity: 1; transform: translateY(0); }

        .headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.25rem; font-weight: 700;
          color: #fff; letter-spacing: -0.01em;
          line-height: 1.1; margin-bottom: 0.75rem;
        }
        .subtext {
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem; color: rgba(255,255,255,0.45);
          line-height: 1.6; font-weight: 300;
        }

        /* Receipt card */
        .receipt-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(197,160,33,0.08);
          border-radius: 20px; padding: 1.75rem;
          margin-bottom: 2rem; position: relative; overflow: hidden;
          opacity: 0; transform: translateY(16px);
          transition: all 0.5s ease 0.2s;
        }
        .receipt-card.show { opacity: 1; transform: translateY(0); }
        .receipt-card:hover { border-color: rgba(197,160,33,0.2); }

        /* Dashed divider */
        .dashed-line {
          border: none;
          border-top: 1px dashed rgba(197,160,33,0.12);
          margin: 1.5rem 0;
        }

        .label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem; font-weight: 500;
          color: rgba(197,160,33,0.5);
          letter-spacing: 0.18em; text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .amount-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.75rem; font-weight: 700;
          color: #fff; letter-spacing: -0.02em;
          display: flex; align-items: baseline; gap: 0.35rem;
          line-height: 1;
        }
        .currency {
          font-family: 'Inter', sans-serif;
          font-size: 1.25rem; font-weight: 400;
          color: #c5a021;
        }

        .txn-row {
          display: flex; justify-content: space-between; align-items: center;
        }
        .txn-id-wrap {
          display: flex; align-items: center; gap: 0.5rem;
        }
        .txn-id {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6875rem; font-weight: 500;
          color: rgba(255,255,255,0.6);
          background: rgba(255,255,255,0.05);
          padding: 0.375rem 0.625rem; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.07);
        }
        .copy-btn {
          background: transparent; border: none; cursor: pointer;
          color: rgba(255,255,255,0.3); padding: 0.25rem;
          display: flex; align-items: center;
          transition: color 0.2s; border-radius: 6px;
        }
        .copy-btn:hover { color: #c5a021; }

        /* Status badge */
        .status-badge {
          display: inline-flex; align-items: center; gap: 0.375rem;
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.2);
          color: #34d399; font-size: 0.6875rem; font-weight: 600;
          letter-spacing: 0.05em;
          padding: 0.25rem 0.75rem; border-radius: 999px;
          margin-bottom: 1rem;
          font-family: 'DM Mono', monospace;
        }
        .status-dot {
          width: 5px; height: 5px; background: #34d399;
          border-radius: 50%; animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

        /* Buttons */
        .btn-area {
          display: flex; flex-direction: column; gap: 0.625rem;
          opacity: 0; transform: translateY(16px);
          transition: all 0.5s ease 0.3s;
        }
        .btn-area.show { opacity: 1; transform: translateY(0); }

        .btn-primary {
          width: 100%; padding: 0.9375rem;
          background: #fff; color: #0f0f0f;
          border: none; border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; font-weight: 700;
          letter-spacing: 0.01em;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 20px rgba(255,255,255,0.1);
        }
        .btn-primary:hover {
          background: #f0fdf4; transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(255,255,255,0.15);
        }
        .btn-primary:active { transform: translateY(0); }

        .btn-ghost {
          width: 100%; padding: 0.9375rem;
          background: transparent; color: rgba(255,255,255,0.35);
          border: 1px solid rgba(255,255,255,0.07); border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; font-weight: 500;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-ghost:hover {
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.12);
        }

        /* Watermark */
        .watermark {
          position: absolute; bottom: -12px; right: -12px;
          opacity: 0.04; transform: rotate(12deg);
          pointer-events: none; color: #fff;
        }
      `}</style>

      <div className={`overlay ${visible ? "show" : ""}`}>
        <div className={`modal ${visible ? "show" : ""}`}>
          <div className="content">

            {/* Check Icon */}
            <div className={`check-wrap ${checkVisible ? "show" : ""}`}>
              <div className="check-outer">
                <div className="check-ring" />
                <div className="check-ring-2" />
                <div className="check-bg">
                  <div className="spark" />
                  <div className="spark" />
                  <div className="spark" />
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 1 }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Status + Title */}
            <div className={`text-area ${contentVisible ? "show" : ""}`}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.875rem' }}>
                <span className="status-badge">
                  <span className="status-dot" />
                  CONFIRMED
                </span>
              </div>
              <h2 className="headline">Payment Successful</h2>
              <p className="subtext">Your premium transaction has been<br />processed and secured.</p>
            </div>

            {/* Receipt Card */}
            <div className={`receipt-card ${contentVisible ? "show" : ""}`}>
              <div className="watermark">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                </svg>
              </div>

              <div className="label">Amount Paid</div>
              <div className="amount-val">
                <span className="currency">₹</span>
                {amount.toLocaleString("en-IN")}
              </div>

              <hr className="dashed-line" />

              <div className="txn-row">
                <div className="label" style={{ marginBottom: 0 }}>Transaction ID</div>
                <div className="txn-id-wrap">
                  <span className="txn-id">{paymentId}</span>
                  <button className="copy-btn" onClick={handleCopy} title="Copy ID">
                    {copied
                      ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                    }
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`btn-area ${contentVisible ? "show" : ""}`}>
              <button className="btn-primary" onClick={() => window.open(receiptUrl, "_blank")}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                Download Receipt
              </button>
              <button className="btn-ghost" onClick={onClose}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                Back to Home
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}