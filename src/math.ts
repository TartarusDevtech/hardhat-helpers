import { BigNumber, BigNumberish } from "ethers";

/**
 * 100% in basis points.
 */
export const BASIS_POINTS = BigNumber.from(10_000);

/**
 * Calculates a share's portion of the given value.
 * @param value The base value to calculate from.
 * @param shareInBasisPoints How much percentage of the value to calculate, in basis points.
 * @param roundUp True if the result should be rounded up, false if it should be rounded down.
 */
export function calcShare(value: BigNumberish, shareInBasisPoints: BigNumberish, roundUp: boolean = false): BigNumber {
  let result = BigNumber.from(value).mul(shareInBasisPoints).div(BASIS_POINTS);
  if (roundUp) {
    if (result.mul(BASIS_POINTS).div(shareInBasisPoints).lt(value)) {
      result = result.add(1);
    }
  }
  return result;
}

/**
 * Calculates a value's remainder after a share has been deducted from it.
 * @param value The base value to calculate from.
 * @param shareInBasisPoints How much percentage of the value to deduct, in basis points.
 * @param roundUpShare True if the share should be rounded up, false if it should be rounded down.
 */
export function calcShareRemainder(
  value: BigNumberish,
  shareInBasisPoints: BigNumberish,
  roundUpShare: boolean = false
): BigNumber {
  return BigNumber.from(value).sub(calcShare(value, shareInBasisPoints, roundUpShare));
}
