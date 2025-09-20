import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Krill - Evolving Creator Economy",
  description: "Invest, Evolve, and Grow with Your Favorite Creators",
  keywords: "Web3, Creator Economy, NFT, Investment, Content Evolution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "glass-effect",
              style: {
                background: "rgba(0, 0, 0, 0.8)",
                color: "#fff",
                border: "1px solid rgba(139, 92, 246, 0.3)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
