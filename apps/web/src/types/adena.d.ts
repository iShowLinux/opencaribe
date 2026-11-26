/**
 * Minimal typings for the Adena browser extension's injected API.
 * Only the methods used by OpenCaribe are declared; see docs.adena.app.
 */
export {};

declare global {
  interface Window {
    adena?: AdenaProvider;
  }
}

interface AdenaAccount {
  status: 'ACTIVE' | 'IN_ACTIVE';
  address: string;
  coins: string;
  public_key?: { '@type': string; value: string };
  account_number?: string;
  sequence?: string;
  chainId?: string;
}

interface AdenaResponse<T> {
  code: number;
  status: 'success' | 'failure';
  type: string;
  message: string;
  data: T;
}

interface AdenaProvider {
  AddEstablish(name: string): Promise<AdenaResponse<Record<string, never>>>;
  GetAccount(): Promise<AdenaResponse<AdenaAccount>>;
  DoContract(request: unknown): Promise<AdenaResponse<unknown>>;
  SignTx?(request: unknown): Promise<AdenaResponse<unknown>>;
}
