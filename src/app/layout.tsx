import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Header from "@/components/organisms/Header";
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner";
import Footer from "@/components/organisms/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Halo",
  description: "Your own journal experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en"
        suppressHydrationWarning
      >
        <body
          className={`${inter.className} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">
              {children}
              <Toaster richColors />
            </main>

            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
