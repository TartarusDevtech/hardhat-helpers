import { BigNumber, BigNumberish } from "ethers";

export const BASIS_POINTS = BigNumber.from(10_000);

export function calcShare(value: BigNumberish, shareInBasisPoints: BigNumberish, roundUp: boolean = false): BigNumber {
  let result = BigNumber.from(value).mul(shareInBasisPoints).div(BASIS_POINTS);
  if (roundUp) {
    if (result.mul(BASIS_POINTS).div(shareInBasisPoints).lt(value)) {
      result = result.add(1);
    }
  }
  return result;
}
