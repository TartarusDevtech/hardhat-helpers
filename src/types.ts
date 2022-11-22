/**
 * Allows a caller to specify an address string, a SignerWithAddress, or a Contract instance.
 */
export type AddressLike = string | { address: string };

export function toAddress(value: AddressLike): string {
  if (typeof value === "string") {
    return value;
  } else {
    return value.address;
  }
}
