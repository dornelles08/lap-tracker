"use client";

import { signInWithEmail } from "@/lib/auth";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface LoginFormProps {
  onSignUpClick: () => void;
}

export function LoginForm({ onSignUpClick }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async () => {
    const result = await signInWithEmail(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      setError(null);
    }
  };

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setPassword(e.target.value);
  };

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="pl-10"
            value={email}
            onChange={onEmailChange}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="sua senha"
            className="pl-10 pr-10"
            value={password}
            onChange={onPasswordChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 -translate-y-1/2 h-4 w-4 text-muted-foreground p-0 m-0"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button onClick={handleEmailLogin}>Entrar</Button>
      <div className="text-center text-sm">
        Não tem uma conta?{" "}
        <Button variant="link" onClick={onSignUpClick}>
          Cadastre-se
        </Button>
      </div>
    </div>
  );
}
