"use client";

import { createUserWithEmail } from "@/lib/auth";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface SignUpFormProps {
  onLoginClick: () => void;
}

export function SignUpForm({ onLoginClick }: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSignUp = async () => {
    const result = await createUserWithEmail(email, password);
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

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setName(e.target.value);
  };

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            type="text"
            placeholder="seu nome"
            className="pl-10"
            value={name}
            onChange={onNameChange}
          />
        </div>
      </div>
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
            className="absolute right-4 top-3.5 -translate-y-1/2 h-4 w-4 text-muted-foreground p-0 m-0"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button onClick={handleEmailSignUp}>Cadastrar</Button>
      <div className="text-center text-sm">
        Já tem uma conta?{" "}
        <Button variant="link" onClick={onLoginClick}>
          Faça login
        </Button>
      </div>
    </div>
  );
}
