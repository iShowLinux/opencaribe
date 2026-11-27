import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function MessagesRedirect() {
  const store = await cookies();
  const code = store.get('oc_country')?.value ?? 'tt';
  redirect(`/${code}/messages`);
}
