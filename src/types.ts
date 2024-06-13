/// Allows a caller to specify an address string, a SignerWithAddress, or a Contract instance.
export type Addressish = string | { address: string };
export function toAddress(value: Addressish): string {
  if (typeof value === "string") {
    return value;
  } else {
    return value.address;
  }
}

export type TransactionHashish = string | { hash: string };
export function toTxHash(tx: TransactionHashish): `0x${string}` {
  let result: string;
  if (typeof tx === "string") {
    result = tx;
  } else {
    result = tx.hash;
  }
  if (!result.startsWith("0x")) {
    throw new Error(`Invalid transaction hash, must start with '0x' (${result})`);
  }
  return result as `0x${string}`;
}
