import type { Metadata } from "next";
import "./globals.css";
import { ThemeModeScript } from "flowbite-react";
import StytchProvider from "./components/StytchProvider";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import Footers from "./components/footer";
import AppNavbar from "./components/navbar";
const font = Work_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Iterative",
  description:
    "Build amazing applications without writing a single line of code.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StytchProvider>
      <html lang="en">
        <head>
          <ThemeModeScript />
        </head>
        <body className={font.className}>
          {" "}
          <AppNavbar /> {children}
          <Footers />
        </body>
      </html>
    </StytchProvider>
  );
}
