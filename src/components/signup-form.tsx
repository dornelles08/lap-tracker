"use client";

import { createUserWithEmail } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface SignUpFormProps {
  onLoginClick: () => void;
}

const SignUpSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type SignUpFormValues = z.infer<typeof SignUpSchema>;

export function SignUpForm({ onLoginClick }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setFirebaseError(null);
    const result = await createUserWithEmail(data.email, data.password, data.name);
    if (result.error) {
      setFirebaseError(result.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-sm flex-col gap-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            type="text"
            placeholder="seu nome"
            className="pl-10"
            {...register("name")}
          />
        </div>
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
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
            {...register("email")}
          />
        </div>
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
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
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3.5 -translate-y-1/2 h-4 w-4 text-muted-foreground p-0 m-0"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>
      {firebaseError && <p className="text-sm text-destructive">{firebaseError}</p>}
      <Button type="submit" disabled={isSubmitting}>
        Cadastrar
      </Button>
      <div className="text-center text-sm">
        Já tem uma conta?{" "}
        <Button variant="link" onClick={onLoginClick}>
          Faça login
        </Button>
      </div>
    </form>
  );
}
