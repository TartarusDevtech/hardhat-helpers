/**
 * Allows a caller to specify an address string, a SignerWithAddress, or a Contract instance.
 */
export type Addressish = string | { address: string } | { account: { address: string } };

export function toAddress(value: Addressish): `0x${string}` {
  let result: string;
  if (typeof value === "string") {
    result = value;
  } else if ('address' in value) {
    result = value.address;
  } else if ('account' in value) {
    result = value.account.address;
  } else {
    throw new Error("Invalid address");
  }
  return result as `0x${string}`;
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
