import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #030712 0%, #0f172a 35%, #1e1b4b 65%, #1d4ed8 100%)',
    }}>
      <style>{`
        .cl-rootBox { transform: scale(1.18); transform-origin: center; }
        .cl-card { font-family: "Google Sans", "Segoe UI", Roboto, sans-serif !important; font-size: 16px !important; }
        .cl-headerTitle { font-size: 24px !important; font-weight: 700 !important; }
      `}</style>
      <SignIn forceRedirectUrl="/dashboard" />
    </div>
  )
}