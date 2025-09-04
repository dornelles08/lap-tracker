'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  createUserWithEmail,
  signInWithEmail,
  signInWithGoogle,
} from '@/lib/auth';
import { useState } from 'react';
import GoogleIcon from './GoogleIcon';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function LoginDialog() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async () => {
    const result = await signInWithEmail(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      setError(null);
    }
  };

  const handleEmailSignUp = async () => {
    const result = await createUserWithEmail(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      setError(null);
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
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

  const onSigningUpChange = (isSigningUp: boolean) => {
    setError(null);
    setIsSigningUp(isSigningUp);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Login</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isSigningUp ? 'Cadastro' : 'Login'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={onEmailChange}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={onPasswordChange}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={isSigningUp ? handleEmailSignUp : handleEmailLogin}>
            {isSigningUp ? 'Cadastrar' : 'Entrar'}
          </Button>
        </div>

        <div className="text-center text-sm">
          {isSigningUp ? (
            <>
              Já tem uma conta?{' '}
              <Button variant="link" onClick={() => onSigningUpChange(false)}>
                Faça login
              </Button>
            </>
          ) : (
            <>
              Não tem uma conta?{' '}
              <Button variant="link" onClick={() => onSigningUpChange(true)}>
                Cadastre-se
              </Button>
            </>
          )}
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou continue com
            </span>
          </div>
        </div>
        <Button variant="outline" onClick={handleGoogleSignIn}>
          <GoogleIcon className="mr-2 h-4 w-4" />
          Login with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}
