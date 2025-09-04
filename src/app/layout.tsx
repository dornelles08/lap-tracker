import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lap Tracker - Cronômetro Online com Contador de Voltas",
  description:
    "Cronômetro online e contador de voltas preciso e fácil de usar. Grave suas sessões de treino, analise seu tempo de volta e acompanhe seu progresso. Ideal para corrida, natação e outras atividades.",
  keywords: [
    "cronômetro online",
    "contador de voltas",
    "lap tracker",
    "marcador de tempo",
    "cronômetro para corrida",
    "stopwatch online",
  ],
  authors: [{ name: "dornelles", url: "https://dornelles.dev" }],
  creator: "dornelles",
  publisher: "dornelles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </html>
  );
}
