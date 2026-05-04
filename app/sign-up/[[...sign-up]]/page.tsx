import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0b1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Syne:wght@700;800&display=swap');

        /* Make Clerk card bigger and match dark theme */
        .cl-rootBox {
          width: 100% !important;
          max-width: 480px !important;
        }
        .cl-card {
          background: #13142a !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 20px !important;
          box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1) !important;
          padding: 40px !important;
        }
        .cl-headerTitle {
          color: #f0f0ff !important;
          font-family: 'Syne', sans-serif !important;
          font-size: 24px !important;
          font-weight: 800 !important;
        }
        .cl-headerSubtitle {
          color: #7777aa !important;
          font-size: 14px !important;
        }
        .cl-socialButtonsBlockButton {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 10px !important;
          color: #e0e0f0 !important;
          height: 48px !important;
          font-size: 14px !important;
          transition: background 0.15s !important;
        }
        .cl-socialButtonsBlockButton:hover {
          background: rgba(255,255,255,0.09) !important;
        }
        .cl-dividerLine { background: rgba(255,255,255,0.08) !important; }
        .cl-dividerText { color: #444466 !important; }
        .cl-formFieldLabel { color: #9999bb !important; font-size: 13px !important; }
        .cl-formFieldInput {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 10px !important;
          color: #f0f0ff !important;
          height: 48px !important;
          font-size: 14px !important;
        }
        .cl-formFieldInput:focus {
          border-color: rgba(124,58,237,0.6) !important;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.15) !important;
        }
        .cl-formButtonPrimary {
          background: linear-gradient(135deg, #7c3aed, #6d28d9) !important;
          border-radius: 10px !important;
          height: 48px !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          box-shadow: 0 0 20px rgba(124,58,237,0.4) !important;
          transition: opacity 0.15s !important;
        }
        .cl-formButtonPrimary:hover { opacity: 0.9 !important; }
        .cl-footerActionText { color: #555577 !important; font-size: 13px !important; }
        .cl-footerActionLink { color: #a78bfa !important; font-weight: 600 !important; }
        .cl-footerActionLink:hover { color: #c4b5fd !important; }
        .cl-internal-b3fm6y { color: #a78bfa !important; }
        .cl-badge { background: rgba(124,58,237,0.2) !important; color: #a78bfa !important; border: none !important; display: none !important; }
      `}</style>

      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{ position: 'absolute', top: '24px', left: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '32px', height: '32px',
          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: '14px',
          fontFamily: "'Syne', sans-serif",
        }}>S</div>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '17px', fontWeight: 800, color: '#f0f0ff' }}>SEOAgent</span>
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: '480px', padding: '0 24px' }}>
        <SignUp
          appearance={{
            variables: {
              colorPrimary: '#7c3aed',
              colorBackground: '#13142a',
              colorText: '#f0f0ff',
              colorTextSecondary: '#7777aa',
              colorInputBackground: 'rgba(255,255,255,0.05)',
              colorInputText: '#f0f0ff',
              borderRadius: '10px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
            },
          }}
        />
      </div>
    </div>
  );
}