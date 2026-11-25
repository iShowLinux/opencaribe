import { AuthForm } from '@/components/AuthForm';

export default function RegisterPage() {
  const configured = Boolean(process.env.DATABASE_URL && process.env.BETTER_AUTH_SECRET);
  return <AuthForm mode="register" configured={configured} />;
}
