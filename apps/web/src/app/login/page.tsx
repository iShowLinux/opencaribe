import { AuthForm } from '@/components/AuthForm';

export default function LoginPage() {
  const configured = Boolean(process.env.DATABASE_URL && process.env.BETTER_AUTH_SECRET);
  return <AuthForm mode="login" configured={configured} />;
}
