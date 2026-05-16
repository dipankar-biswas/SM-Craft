export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { SessionProvider } from "next-auth/react";
import { AppProvider } from "./context/AppContext";
import LayoutSet from "./layoutset";
import { dbConnect } from "@/service/mongo";
import { getCategories } from "@/queries/categories";
import { getSettings } from "@/queries/settings";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MegaStore - Your One Stop Shop",
  description: "Best products at best prices",
};

export default async function RootLayout({ children }) {
  await dbConnect();
  const categories = await getCategories();
  const settings = await getSettings();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <AppProvider>
            <LayoutSet categories={categories} settings={settings}>
              {children}
            </LayoutSet>
          </AppProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
