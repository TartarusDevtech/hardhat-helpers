import { BigNumber, BigNumberish, providers } from "ethers";
import { ethers } from "hardhat";

export const ONE_MINUTE = 60;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;

/**
 * @param seconds How many seconds from now the timestamp should be set to.
 * @param shouldAdvanceBlock True if a block should be mined, effecting the next read call.
 * False to use this value as the timestamp for the next write call.
 * @returns The new timestamp.
 */
export async function increaseTime(seconds: BigNumberish, shouldAdvanceBlock = true): Promise<number> {
  const secondsNumber = BigNumber.from(seconds).toNumber();
  const now = await getBlockTime();
  const targetTime = now + secondsNumber;
  await increaseTimeTo(targetTime, shouldAdvanceBlock);
  return targetTime;
}

export async function increaseTimeTo(timestamp: BigNumberish, shouldAdvanceBlock = true): Promise<void> {
  const timestampNumber = BigNumber.from(timestamp).toNumber();
  const provider: providers.JsonRpcProvider = ethers.provider;
  await provider.send("evm_setNextBlockTimestamp", [timestampNumber]);
  if (shouldAdvanceBlock) {
    await advanceBlock();
  }
}

export async function increaseTimeToNextHour(): Promise<void> {
  const time = await getBlockTime();
  const timeToMoveTo = Math.ceil((time + 1) / ONE_HOUR) * ONE_HOUR;
  await increaseTimeTo(timeToMoveTo);
}

export async function getBlockTime(block: string | number = "latest"): Promise<number> {
  const provider: providers.JsonRpcProvider = ethers.provider;
  return (await provider.getBlock(block)).timestamp;
}

export async function advanceBlock() {
  const provider: providers.JsonRpcProvider = ethers.provider;
  await provider.send("evm_mine", []);
}
