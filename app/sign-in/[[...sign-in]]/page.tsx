import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c2e 0%, #1a1635 50%, #0f0c2e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <style>{`
        .cl-rootBox { transform: scale(1.4); transform-origin: center; }
      `}</style>
      <SignUp />
    </div>
  );
}