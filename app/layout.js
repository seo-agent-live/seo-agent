import { ClerkProvider, UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "AI SEO Content Agent",
  description: "Generate SEO-ready content from keyword and SERP insights.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body style={{ margin: 0 }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}