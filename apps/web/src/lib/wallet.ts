/**
 * Client-side helpers for the Adena (gno.land) wallet connection used by
 * wallet-authenticated posting. Key material never leaves the extension; the
 * app only receives the connected account details.
 */
export interface WalletAccount {
  address: string;
  chainId: string;
  publicKey?: string;
  coins?: string;
}

/** gno.land bech32 account addresses start with g1 followed by 38 lowercase characters. */
export function isGnoAddress(value: string): boolean {
  return /^g1[0-9a-z]{38}$/.test(value);
}

/** Shortens an address for display: g1abcd…wxyz */
export function displayAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/**
 * Requests a connection and reads the active account.
 * Throws an Error with a user-presentable message when the extension rejects
 * the request or no account is available.
 */
async function readAdenaAccount(): Promise<WalletAccount | null> {
  try {
    const adena = window.adena;
    if (!adena) return null;
    const response = await adena.GetAccount();
    if (response.status === 'success' && response.data?.address) {
      const coins = (response.data as { coins?: string }).coins;
      return { address: response.data.address, chainId: response.data.chainId ?? '', coins };
    }
  } catch {
    /* extension not ready */
  }
  return null;
}

/**
 * Requests a connection and reads the active account. Returns the existing
 * session when Adena is already established instead of failing.
 */
export async function connectAdenaWallet(appName = 'OpenCaribe'): Promise<WalletAccount> {
  if (typeof window === 'undefined' || !window.adena) {
    throw new Error('Wallet not detected. Install Adena to continue.');
  }

  let account = await readAdenaAccount();
  if (!account) {
    const established = await window.adena?.AddEstablish(appName);
    if (established.status !== 'success' && !/already connected/i.test(established.message ?? '')) {
      throw new Error(established.message || 'The wallet connection was rejected.');
    }
    account = await readAdenaAccount();
  }
  if (!account) {
    throw new Error('No connected account found.');
  }
  return account;
}
