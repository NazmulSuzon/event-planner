import "./globals.css";
import type { ReactNode } from "react";

import NavBar from "./NavBar/NavBar.jsx";
// import FooterPage from "./Footer/footer.js";
import AuthProvider from "./context/AuthContext"; // ✅ import context
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

export const metadata = {
  title: "The Sprintable",
  description: "Campus Event Planner",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="bg-white text-black font-medium">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <AppRouterCacheProvider>
            
            <NavBar />
            <main className="grow">{children}</main>
            {/* <FooterPage></FooterPage> */}
          </AppRouterCacheProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
