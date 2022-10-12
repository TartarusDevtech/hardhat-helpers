import { BigNumber } from "ethers";
import { ethers } from "hardhat";

export async function getStorage(contract: { address: string }, slot: string | number): Promise<string> {
  slot = getSlot(slot, true);
  return await ethers.provider.send("eth_getStorageAt", [contract.address, slot]);
}

export async function getStorageAddress(contract: { address: string }, slot: string | number): Promise<string> {
  let value = await getStorage(contract, slot);
  value = ethers.utils.hexStripZeros(value);
  value = ethers.utils.hexZeroPad(value, 20);
  return ethers.utils.getAddress(value);
}

export async function getStorageNumber(contract: { address: string }, slot: string | number): Promise<BigNumber> {
  const value = await getStorage(contract, slot);
  return BigNumber.from(value);
}

export async function hasCode(contract: { address: string } | string): Promise<boolean> {
  const address = typeof contract === "string" ? contract : contract.address;
  const code = await ethers.provider.getCode(address);
  return code !== "0x";
}

export async function setCodeFromContract(toContract: { address: string }, fromContract: { address: string }) {
  const code = await ethers.provider.getCode(fromContract.address);
  await setCodeTo(toContract, code);
}

export async function setCodeTo(contract: { address: string }, code: string) {
  await ethers.provider.send("hardhat_setCode", [contract.address, code]);
}

export async function setStorage(contract: { address: string }, slot: string | number, value: string | number) {
  slot = getSlot(slot);
  if (typeof value === "number") {
    value = ethers.utils.hexValue(value);
  }
  value = ethers.utils.hexZeroPad(value, 32);
  await ethers.provider.send("hardhat_setStorageAt", [contract.address, slot, value]);
}

function getSlot(slot: string | number, pad = false): string {
  if (typeof slot === "number") {
    slot = ethers.utils.hexValue(slot);
  }
  if (pad) {
    slot = ethers.utils.hexZeroPad(slot, 32);
  }
  return slot;
}
