"use client";

import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-700 w-full rounded-xl">
      <div className="flex items-center gap-2">
        <Image src="/kronos512x512.png" alt="logo" width={40} height={40} className="h-10 w-10" />
        <h1 className="text-2xl font-semibold">Kronos</h1>
      </div>
      <ThemeToggle />
    </header>
  );
}
