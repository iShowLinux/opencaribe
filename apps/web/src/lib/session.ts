import { cookies } from 'next/headers';
import { getUserBySession, SESSION_COOKIE, type LocalUser } from './store';

/** Reads the signed-in demo account from the session cookie (server components/actions only). */
export async function getCurrentUser(): Promise<LocalUser | undefined> {
  const store = await cookies();
  const user = await getUserBySession(store.get(SESSION_COOKIE)?.value);
  if (user?.banned) return undefined;
  return user;
}
