import INIT from "@/context/INIT";
import "./globals.css";
import { Source_Sans_3 } from "next/font/google";

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Rock Paper Scissors",
  description: "Play Rock Paper Scissors with friends online!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="R P S" />
      </head>
      <body
        className={`${sourceSans3.variable} antialiased ${sourceSans3.className}`}
      >
        <INIT>{children}</INIT>
      </body>
    </html>
  );
}
