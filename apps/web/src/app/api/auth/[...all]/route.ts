import { createAuth } from '@opencaribe/authentication';

async function handler(request: Request) {
  return createAuth().handler(request);
}

export { handler as GET, handler as POST };
