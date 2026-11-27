'use server';

import { cookies } from 'next/headers';
import { isValidLocale } from '@opencaribe/localization';
import { createSession, createUser, destroySession, SESSION_COOKIE, setUserRole, verifyUser } from '@/lib/store';
import { isAdminEmail } from '@/lib/admin';

export interface AuthState {
  status: 'idle' | 'error' | 'success';
  message?: string;
}

async function locale(): Promise<'en' | 'es'> {
  const store = await cookies();
  const raw = store.get('NEXT_LOCALE')?.value ?? 'en';
  return isValidLocale(raw) ? raw : 'en';
}

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

async function startSession(userId: string): Promise<void> {
  const session = await createSession(userId);
  const store = await cookies();
  store.set(SESSION_COOKIE, session.token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60,
  });
}

export async function registerAction(_previous: AuthState, formData: FormData): Promise<AuthState> {
  const lang = await locale();
  const fail = (key: 'invalid' | 'taken') => ({
    status: 'error' as const,
    message: lang === 'es'
      ? key === 'taken' ? 'Ese correo ya está registrado.' : 'Revisa los datos del formulario.'
      : key === 'taken' ? 'That email is already registered.' : 'Please check the form fields.',
  });

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (name.length < 2 || name.length > 80 || !validEmail(email) || password.length < 10 || password.length > 200) {
    return fail('invalid');
  }

  try {
    const user = await createUser({ name, email, password });
    await startSession(user.id);
    return { status: 'success' };
  } catch (error) {
    return fail(error instanceof Error && error.message === 'EMAIL_TAKEN' ? 'taken' : 'invalid');
  }
}

export async function loginAction(_previous: AuthState, formData: FormData): Promise<AuthState> {
  const lang = await locale();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!validEmail(email) || password.length === 0) {
    return {
      status: 'error',
      message: lang === 'es' ? 'Revisa tu correo y contraseña.' : 'Please check your email and password.',
    };
  }

  const user = await verifyUser(email, password);
  if (!user) {
    return {
      status: 'error',
      message: lang === 'es' ? 'Correo o contraseña incorrectos.' : 'Incorrect email or password.',
    };
  }
  if (user.banned) {
    return { status: 'error', message: 'This account is suspended.' };
  }
  if (isAdminEmail(email) && user.role !== 'admin') {
    await setUserRole(user.id, 'admin');
  }
  await startSession(user.id);
  return { status: 'success' };
}

export async function forgotAction(): Promise<AuthState> {
  const lang = await locale();
  return {
    status: 'success',
    message: lang === 'es'
      ? 'Si la cuenta existe, se enviará un enlace de recuperación (disponible cuando el correo esté configurado).'
      : 'If the account exists, a reset link will be sent (once email delivery is configured).',
  };
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  await destroySession(store.get(SESSION_COOKIE)?.value);
  store.delete(SESSION_COOKIE);
}
