import { isGnoAddress } from './wallet';

/**
 * Reads a gno.land token balance through the public RPC's read-only qeval
 * endpoint. Returns null when the network/realm cannot answer so callers can
 * fail open instead of blocking a marketplace conversation.
 */
export async function getGnotBalanceMinor(address: string): Promise<number | null> {
  if (!isGnoAddress(address)) return null;
  const rpc = process.env.GNO_RPC_URL ?? 'https://rpc.gno.land';
  const expression = `gno.land/r/gnoland/wugnot.BalanceOf("${address}")`;
  try {
    const response = await fetch(rpc, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'abci_query',
        params: { path: 'vm/qeval', data: Buffer.from(expression, 'utf8').toString('base64'), height: '0', prove: false },
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as {
      result?: { response?: { ResponseBase?: { Error?: unknown; Data?: string | null } } };
    };
    const base = payload.result?.response?.ResponseBase;
    if (!base || base.Error || !base.Data) return null;
    return parseQevalInteger(base.Data);
  } catch {
    return null;
  }
}

/** Decodes `(123 int64)` (base64-wrapped qeval output) into a JS number. */
export function parseQevalInteger(dataBase64: string): number | null {
  try {
    const text = Buffer.from(dataBase64, 'base64').toString('utf8');
    const match = /(-?\d+)\s+int64/.exec(text);
    if (!match) return null;
    const value = Number(match[1]);
    return Number.isSafeInteger(value) ? value : null;
  } catch {
    return null;
  }
}
