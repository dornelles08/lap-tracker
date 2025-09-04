"use client";

import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";
import Image from "next/image";
import { LoginDialog } from "./LoginDialog";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-700 w-full rounded-xl">
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="logo" width={60} height={60} className="h-16 w-16" />
        <h1 className="text-2xl font-semibold hidden sm:block">Lap Tracker</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />
        {user ? (
          <div className="flex items-center gap-4">
            <p>Olá, {user.displayName}</p>
            <Button onClick={signOut}>Logout</Button>
          </div>
        ) : (
          <LoginDialog />
        )}
      </div>
    </header>
  );
}
