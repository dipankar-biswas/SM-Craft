export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import LayoutSet from "./layoutset";
import { dbConnect } from "@/service/mongo";
import { AppProvider } from "./context/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard - Your One Stop Shop",
  description: "Best products at best prices",
};

export default async function RootLayout({ children }) {
  await dbConnect();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <LayoutSet>{children}</LayoutSet>
        </AppProvider>
      </body>
    </html>
  );
}
