'use client';

import { useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { SocialProvider } from '@opencaribe/authentication';
import { Button, Card, Container, Input, Label } from '@opencaribe/ui';
import { forgotAction, loginAction, registerAction, type AuthState } from '@/app/auth-actions';

type Mode = 'login' | 'register' | 'forgot';
const initialState: AuthState = { status: 'idle' };

interface Props {
  mode: Mode;
  /** Kept for backwards compatibility; local demo auth always works. */
  configured?: boolean;
  socialProviders?: SocialProvider[];
}

export function AuthForm({ mode, socialProviders = [] }: Props) {
  const t = useTranslations('auth');
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setBusy(true);
    setMessage('');
    try {
      const state =
        mode === 'login'
          ? await loginAction(initialState, formData)
          : mode === 'register'
            ? await registerAction(initialState, formData)
            : await forgotAction();
      if (state.status === 'success') {
        if (mode === 'forgot') {
          setMessage(state.message ?? t('checkEmail'));
        } else {
          router.push('/');
          router.refresh();
        }
      } else {
        setMessage(state.message ?? 'Request failed');
      }
    } catch {
      setMessage('Request failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  const title = mode === 'login' ? t('loginTitle') : mode === 'register' ? t('registerTitle') : t('forgotTitle');
  const submitLabel = mode === 'login' ? t('signIn') : mode === 'register' ? t('createAccount') : t('sendReset');

  return (
    <Container className="max-w-md py-16">
      <h1 className="text-3xl font-black tracking-tight text-navy-900 dark:text-navy-50">{title}</h1>
      <Card className="mt-6 p-6">
        {socialProviders.length > 0 && (
          <div className="mb-5 grid gap-2">
            <p className="text-center text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t('orContinueWith')}
            </p>
            {socialProviders.map((provider) => (
              <a
                key={provider.id}
                href={`/api/auth/sign-in/${provider.id}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                {provider.id === 'google' ? t('continueGoogle') : provider.id === 'twitter' ? t('continueX') : provider.label}
              </a>
            ))}
          </div>
        )}
        <form ref={formRef} onSubmit={submit} noValidate className="grid gap-4">
          {mode === 'register' && (
            <div>
              <Label htmlFor="name">{t('name')}</Label>
              <Input id="name" name="name" autoComplete="name" required />
            </div>
          )}
          <div>
            <Label htmlFor="email">{t('email')}</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          {mode !== 'forgot' && (
            <div>
              <Label htmlFor="password">{t('password')}</Label>
              <Input id="password" name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={10} required />
            </div>
          )}
          <Button type="submit" disabled={busy} className="w-full">{busy ? '…' : submitLabel}</Button>
          {message && <p role="status" className="text-sm text-slate-700 dark:text-slate-300">{message}</p>}
        </form>
      </Card>
    </Container>
  );
}
