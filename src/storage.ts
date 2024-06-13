import { BigNumber, BigNumberish, providers } from "ethers";
import { ethers } from "hardhat";

import { Addressish, toAddress } from "./types";

export async function getStorage(
  contract: Addressish,
  slot: string | number,
  fromProvider?: providers.JsonRpcProvider
): Promise<string> {
  slot = getSlot(slot, true);
  return await (fromProvider ?? ethers.provider).send("eth_getStorageAt", [toAddress(contract), slot]);
}

export async function getStorageAddress(
  contract: Addressish,
  slot: string | number,
  fromProvider?: providers.JsonRpcProvider
): Promise<string> {
  let value = await getStorage(contract, slot, fromProvider);
  value = ethers.utils.hexStripZeros(value);
  value = ethers.utils.hexZeroPad(value, 20);
  return ethers.utils.getAddress(value);
}

export async function getStorageNumber(contract: Addressish, slot: string | number): Promise<BigNumber> {
  const value = await getStorage(contract, slot);
  return BigNumber.from(value);
}

async function getStoragePackedNumber(
  contract: Addressish,
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
  contract: Addressish,
  slot: string | number,
  offsetInBytes: number
): Promise<BigNumber> {
  const value = await getStoragePackedNumber(contract, slot, offsetInBytes, 4);
  return value;
}

export async function getStoragePackedBool(
  contract: Addressish,
  slot: string | number,
  offsetInBytes: number
): Promise<boolean> {
  const value = await getStoragePackedUint8(contract, slot, offsetInBytes);
  return value.eq(1);
}
export async function getStoragePackedUint8(
  contract: Addressish,
  slot: string | number,
  offsetInBytes: number
): Promise<BigNumber> {
  const value = await getStoragePackedNumber(contract, slot, offsetInBytes, 1);
  return value;
}

export async function getCode(fromContract: Addressish, fromProvider?: providers.Provider): Promise<string> {
  return await (fromProvider ?? ethers.provider).getCode(toAddress(fromContract));
}

export async function hasCode(contract: Addressish | string): Promise<boolean> {
  const address = typeof contract === "string" ? contract : contract.address;
  const code = await ethers.provider.getCode(address);
  return code !== "0x";
}

export async function setCodeFromContract(
  toContract: Addressish,
  fromContract: Addressish,
  fromProvider?: providers.JsonRpcProvider,
  include1967Proxy?: boolean
) {
  const code = await getCode(fromContract, fromProvider);
  await setCodeTo(toContract, code);

  if (include1967Proxy) {
    // from https://eips.ethereum.org/EIPS/eip-1967
    const implementationStorageSlot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
    const proxyAddress = await getStorageAddress(fromContract, implementationStorageSlot, fromProvider);
    if (proxyAddress != ethers.constants.AddressZero) {
      const proxyCode = await getCode(proxyAddress, fromProvider);
      await setCodeTo(proxyAddress, proxyCode);
      await setStorage(toContract, implementationStorageSlot, proxyAddress);
    }
  }
}

export async function setCodeTo(contract: Addressish, code: string) {
  await ethers.provider.send("hardhat_setCode", [toAddress(contract), code]);
}

export async function setStorage(contract: Addressish, slot: string | number, value: string | number) {
  slot = getSlot(slot);
  if (typeof value === "number") {
    value = ethers.utils.hexValue(value);
  }
  value = ethers.utils.hexZeroPad(value, 32);
  await ethers.provider.send("hardhat_setStorageAt", [toAddress(contract), slot, value]);
}

export async function setStoragePackedUint32(
  contract: Addressish,
  slot: string | number,
  offsetInBytes: number,
  value: BigNumberish
) {
  await setStoragePackedValue(contract, slot, offsetInBytes, value, 4);
}

export async function setStoragePackedBool(
  contract: Addressish,
  slot: string | number,
  offsetInBytes: number,
  value: boolean
) {
  const numberValue = value ? 1 : 0;
  await setStoragePackedUint8(contract, slot, offsetInBytes, numberValue);
}

export async function setStoragePackedUint8(
  contract: Addressish,
  slot: string | number,
  offsetInBytes: number,
  value: BigNumberish
) {
  await setStoragePackedValue(contract, slot, offsetInBytes, value, 1);
}

async function setStoragePackedValue(
  contract: Addressish,
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
