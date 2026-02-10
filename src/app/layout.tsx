import inter from "@/lib/font";
import { lightTheme } from "@/lib/theme/theme";
import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { AppNavbar } from "./_components/AppNavbar";
import { AppSidebar } from "./_components/AppSidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Medical Platform",
  description: "A desktop application for medical platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${inter.className}`}>
        <Suspense>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={lightTheme}>
              <div className="from-primary-50 to-info-50 w-full overflow-hidden bg-linear-to-br via-gray-50">
                <div className="flex max-h-screen">
                  <AppSidebar />
                  <div className="flex-1 flex-col">
                    <AppNavbar />
                    <div className="h-[calc(100vh-54px)] overflow-y-auto">
                      <div className="h-full p-4 lg:px-8">{children}</div>
                    </div>
                  </div>
                </div>
              </div>
              <Toaster
                toastOptions={{
                  position: "top-right",
                }}
              />
            </ThemeProvider>
          </AppRouterCacheProvider>
        </Suspense>
      </body>
    </html>
  );
}
