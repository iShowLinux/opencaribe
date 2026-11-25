import { headers } from 'next/headers';
import { can, createAuth, type Role } from '@opencaribe/authentication';
import { Badge, Card, Container, SectionTitle } from '@opencaribe/ui';
import { getT } from '@/lib/t';

async function currentRole(): Promise<Role | null> {
  if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET) return null;
  try {
    const session = await createAuth().api.getSession({ headers: await headers() });
    if (!session?.user) return null;
    const role = (session.user as { role?: Role }).role ?? 'user';
    return role;
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  const t = await getT();
  const role = await currentRole();
  const allowed = role !== null && can(role, 'listing:moderate');

  return (
    <Container className="py-12">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-black tracking-tight text-navy-900 dark:text-navy-50">{t('admin.title')}</h1>
        {allowed && <Badge tone="success">{role}</Badge>}
      </div>

      {!allowed ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-600 dark:border-slate-700 dark:text-slate-400">
          {t('admin.restricted')}
        </p>
      ) : (
        <>
          <p className="mt-3 text-sm text-rose-700 dark:text-rose-300">⚠️ {t('admin.mfaRequired')}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[t('admin.queue'), t('admin.reports'), t('admin.roles')].map((title) => (
              <Card key={title} className="p-6">
                <SectionTitle className="text-lg">{title}</SectionTitle>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">0</p>
              </Card>
            ))}
          </div>
        </>
      )}
    </Container>
  );
}
