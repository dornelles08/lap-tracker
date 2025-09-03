"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

export function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-700 w-full rounded-xl">
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="logo" width={60} height={60} className="h-16 w-16" />
        <h1 className="text-2xl font-semibold">Lap Tracker</h1>
      </div>
      <ThemeToggle />
    </header>
  );
}
