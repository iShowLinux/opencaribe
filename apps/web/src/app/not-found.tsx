import { Container } from '@opencaribe/ui';
import { LinkButton } from '@/components/LinkButton';

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-6xl font-black text-teal-700">404</p>
      <h1 className="mt-4 text-2xl font-bold text-navy-900 dark:text-navy-50">Page not found</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">The listing or page you requested does not exist.</p>
      <LinkButton href="/" className="mt-6">Return home</LinkButton>
    </Container>
  );
}
