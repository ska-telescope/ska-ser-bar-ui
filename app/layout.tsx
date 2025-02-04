import React from "react";
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google"; // eslint-disable-line
import { config } from "@fortawesome/fontawesome-svg-core";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import theme from "./components/utils/mui";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

const font = Noto_Sans({ subsets: ["latin"] });

config.autoAddCss = false;

export const metadata: Metadata = {
  title: "SKA Binary Manager",
  description: "SKA Binary Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
