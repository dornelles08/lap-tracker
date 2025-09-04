import {
  type AuthError,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";

function getFirebaseErrorMessage(error: AuthError): string {
  switch (error.code) {
    case "auth/invalid-email":
      return "Email inválido.";
    case "auth/user-disabled":
      return "Este usuário foi desabilitado.";
    case "auth/user-not-found":
      return "Usuário não encontrado.";
    case "auth/wrong-password":
      return "Senha incorreta.";
    case "auth/email-already-in-use":
      return "Este email já está em uso.";
    case "auth/weak-password":
      return "A senha é muito fraca.";
    default:
      return "Ocorreu um erro desconhecido.";
  }
}

export async function signInWithGoogle(): Promise<{
  success: boolean;
  error?: string;
}> {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getFirebaseErrorMessage(error as AuthError),
    };
  }
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getFirebaseErrorMessage(error as AuthError),
    };
  }
}

export async function createUserWithEmail(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getFirebaseErrorMessage(error as AuthError),
    };
  }
}

export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    await auth.signOut();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getFirebaseErrorMessage(error as AuthError),
    };
  }
}
