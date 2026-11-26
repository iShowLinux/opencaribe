/**
 * Client-side helpers for the Adena (gno.land) wallet connection used by
 * wallet-authenticated posting. Key material never leaves the extension; the
 * app only receives the connected account details.
 */
export interface WalletAccount {
  address: string;
  chainId: string;
  publicKey?: string;
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
export async function connectAdenaWallet(appName = 'OpenCaribe'): Promise<WalletAccount> {
  if (typeof window === 'undefined' || !window.adena) {
    throw new Error('Wallet not detected. Install Adena to continue.');
  }

  const established = await window.adena.AddEstablish(appName);
  if (established.status !== 'success') {
    throw new Error(established.message || 'The wallet connection was rejected.');
  }

  const response = await window.adena.GetAccount();
  if (response.status !== 'success' || !response.data?.address) {
    throw new Error(response.message || 'No connected account found.');
  }

  const address = String(response.data.address);
  if (!isGnoAddress(address)) {
    throw new Error('The connected account does not look like a gno.land address.');
  }

  const publicKey =
    response.data.public_key && typeof response.data.public_key.value === 'string'
      ? response.data.public_key.value
      : undefined;

  return {
    address,
    chainId: response.data.chainId ?? '',
    publicKey,
  };
}
