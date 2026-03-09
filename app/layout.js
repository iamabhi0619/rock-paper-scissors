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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
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
