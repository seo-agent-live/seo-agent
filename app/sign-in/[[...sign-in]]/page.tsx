import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c2e 0%, #1a1635 50%, #0f0c2e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        width: '100%',
        maxWidth: '480px',
        padding: '20px'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: 'white' }}>S</div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>SEOAgent</span>
        </div>

        <style>{`
          .cl-rootBox { width: 100% !important; }
          .cl-card { 
            width: 100% !important;
            padding: 40px !important;
            border-radius: 20px !important;
            box-shadow: 0 25px 50px rgba(0,0,0,0.4) !important;
            font-size: 16px !important;
          }
          .cl-headerTitle { font-size: 26px !important; font-weight: 700 !important; }
          .cl-headerSubtitle { font-size: 15px !important; }
          .cl-formButtonPrimary { 
            font-size: 16px !important; 
            padding: 14px !important;
            border-radius: 10px !important;
          }
          .cl-formFieldInput {
            font-size: 15px !important;
            padding: 12px !important;
            border-radius: 8px !important;
          }
          .cl-socialButtonsBlockButton {
            font-size: 15px !important;
            padding: 12px !important;
            border-radius: 8px !important;
          }
        `}</style>

        <SignUp />
      </div>
    </div>
  );
}