import INIT from "@/context/INIT";
import "./globals.css";
import { Source_Sans_3 } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import RegisterServiceWorker from "./register-sw";

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Rock Paper Scissors",
  description: "Play Rock Paper Scissors with friends online!",
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    interactiveWidget: "resizes-content"
  },
  themeColor: "#ffffff",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "R P S"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/web-app-manifest-192x192.png" />
        <link rel="apple-touch-icon" href="/web-app-manifest-192x192.png" />
      </head>
      <body
        className={`${sourceSans3.variable} antialiased ${sourceSans3.className}`}
      >
        <RegisterServiceWorker />
        <INIT>
          <TooltipProvider>
            <div className="px-2">
              {children}
            </div>
          </TooltipProvider>
        </INIT>
      </body>
    </html>
  );
}
