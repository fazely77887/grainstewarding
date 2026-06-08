"use client";

import { createContext, useContext, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { useSheets, type SheetsState } from "@/hooks/useSheets";

const SheetsContext = createContext<SheetsState | null>(null);
export const useSheetsContext = () => {
  const ctx = useContext(SheetsContext);
  if (!ctx) throw new Error("useSheetsContext must be used inside Shell");
  return ctx;
};

export function Shell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sheets = useSheets();

  return (
    <SheetsContext.Provider value={sheets}>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} isDemo={sheets.isDemo} />
      <div className="lg:pl-72">
        <Header onMenu={() => setMenuOpen(true)} updatedAt={sheets.updatedAt} onRefresh={sheets.refresh} loading={sheets.loading} />
        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </SheetsContext.Provider>
  );
}
