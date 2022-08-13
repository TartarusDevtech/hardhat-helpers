import { ethers } from "hardhat";

export async function setCodeFromContract(toContract: { address: string }, fromContract: { address: string }) {
  const code = await ethers.provider.getCode(fromContract.address);
  await setCodeTo(toContract, code);
}

export async function setCodeTo(contract: { address: string }, code: string) {
  await ethers.provider.send("hardhat_setCode", [contract.address, code]);
}

export async function setStorage(contract: { address: string }, slot: string | number, value: string | number) {
  if (typeof slot === "number") {
    slot = ethers.utils.hexValue(slot);
  }
  if (typeof value === "number") {
    value = ethers.utils.hexValue(value);
  }
  value = ethers.utils.hexZeroPad(value, 32);
  await ethers.provider.send("hardhat_setStorageAt", [contract.address, slot, value]);
}
