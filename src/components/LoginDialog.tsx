"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { signInWithGoogle } from "@/lib/auth";
import { useState } from "react";
import GoogleIcon from "./GoogleIcon";
import { LoginForm } from "./login-form";
import { SignUpForm } from "./signup-form";
import { Button } from "./ui/button";

export function LoginDialog() {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error);
    } else {
      setError(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Login</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col p-10">
        <DialogHeader className="mb-4">
          <DialogTitle>{isSigningUp ? "Cadastro" : "Login"}</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          {isSigningUp ? (
            <SignUpForm onLoginClick={() => setIsSigningUp(false)} />
          ) : (
            <LoginForm onSignUpClick={() => setIsSigningUp(true)} />
          )}
        </div>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          className="mx-auto flex w-full max-w-sm"
          variant="outline"
          onClick={handleGoogleSignIn}
        >
          <GoogleIcon className="mr-2 h-4 w-4" />
          Login with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}
