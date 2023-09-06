import { BigNumber, BigNumberish, providers } from "ethers";
import { ethers } from "hardhat";

import { AddressLike, toAddress } from "./types";

export async function getStorage(contract: AddressLike, slot: string | number): Promise<string> {
  slot = getSlot(slot, true);
  return await ethers.provider.send("eth_getStorageAt", [toAddress(contract), slot]);
}

export async function getStorageAddress(contract: AddressLike, slot: string | number): Promise<string> {
  let value = await getStorage(contract, slot);
  value = ethers.utils.hexStripZeros(value);
  value = ethers.utils.hexZeroPad(value, 20);
  return ethers.utils.getAddress(value);
}

export async function getStorageNumber(contract: AddressLike, slot: string | number): Promise<BigNumber> {
  const value = await getStorage(contract, slot);
  return BigNumber.from(value);
}

async function getStoragePackedNumber(
  contract: AddressLike,
  slot: string | number,
  offsetInBytes: number,
  numberOfBytes: number
): Promise<BigNumber> {
  offsetInBytes = 32 - offsetInBytes - numberOfBytes;
  const slotHex = await getStorage(contract, slot);
  const valueHex = "0x" + slotHex.substring(offsetInBytes * 2 + 2, offsetInBytes * 2 + numberOfBytes * 2 + 2);
  return BigNumber.from(valueHex);
}

export async function getStoragePackedUint32(
  contract: AddressLike,
  slot: string | number,
  offsetInBytes: number
): Promise<BigNumber> {
  const value = await getStoragePackedNumber(contract, slot, offsetInBytes, 4);
  return value;
}

export async function getStoragePackedBool(
  contract: AddressLike,
  slot: string | number,
  offsetInBytes: number
): Promise<boolean> {
  const value = await getStoragePackedUint8(contract, slot, offsetInBytes);
  return value.eq(1);
}
export async function getStoragePackedUint8(
  contract: AddressLike,
  slot: string | number,
  offsetInBytes: number
): Promise<BigNumber> {
  const value = await getStoragePackedNumber(contract, slot, offsetInBytes, 1);
  return value;
}

export async function getCode(fromContract: AddressLike, fromProvider?: providers.Provider): Promise<string> {
  return await (fromProvider ?? ethers.provider).getCode(toAddress(fromContract));
}

export async function hasCode(contract: AddressLike | string): Promise<boolean> {
  const address = typeof contract === "string" ? contract : contract.address;
  const code = await ethers.provider.getCode(address);
  return code !== "0x";
}

export async function setCodeFromContract(
  toContract: AddressLike,
  fromContract: AddressLike,
  fromProvider?: providers.Provider
) {
  const code = await getCode(fromContract, fromProvider);
  await setCodeTo(toContract, code);
}

export async function setCodeTo(contract: AddressLike, code: string) {
  await ethers.provider.send("hardhat_setCode", [toAddress(contract), code]);
}

export async function setStorage(contract: AddressLike, slot: string | number, value: string | number) {
  slot = getSlot(slot);
  if (typeof value === "number") {
    value = ethers.utils.hexValue(value);
  }
  value = ethers.utils.hexZeroPad(value, 32);
  await ethers.provider.send("hardhat_setStorageAt", [toAddress(contract), slot, value]);
}

export async function setStoragePackedUint32(
  contract: AddressLike,
  slot: string | number,
  offsetInBytes: number,
  value: BigNumberish
) {
  await setStoragePackedValue(contract, slot, offsetInBytes, value, 4);
}

export async function setStoragePackedBool(
  contract: AddressLike,
  slot: string | number,
  offsetInBytes: number,
  value: boolean
) {
  const numberValue = value ? 1 : 0;
  await setStoragePackedUint8(contract, slot, offsetInBytes, numberValue);
}

export async function setStoragePackedUint8(
  contract: AddressLike,
  slot: string | number,
  offsetInBytes: number,
  value: BigNumberish
) {
  await setStoragePackedValue(contract, slot, offsetInBytes, value, 1);
}

async function setStoragePackedValue(
  contract: AddressLike,
  slot: string | number,
  offsetInBytes: number,
  newValue: BigNumberish,
  numberOfBytes: number
) {
  const hexValue = ethers.utils.hexZeroPad(ethers.utils.hexValue(newValue), numberOfBytes).substring(2);
  let storage = await getStorage(contract, slot);

  // Variables are packed lower order aligned, flipping the offset
  offsetInBytes = 32 - offsetInBytes - hexValue.length / 2;
  // Update existing storage at offset
  storage =
    storage.substring(0, offsetInBytes * 2 + 2) + hexValue + storage.substring(offsetInBytes * 2 + hexValue.length + 2);
  await setStorage(contract, slot, storage);
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
