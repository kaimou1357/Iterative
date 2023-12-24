import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { ThemeModeScript } from "flowbite-react";
import StytchProvider from "./components/StytchProvider";

const inter = Inter({ subsets: ["latin"] });

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
        <body className={inter.className}>
          {" "}
          <Navbar /> {children}
        </body>
        <Footer />
      </html>
    </StytchProvider>
  );
}
