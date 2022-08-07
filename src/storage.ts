import { ethers } from "hardhat";

export async function setCodeFromContract(toContract: { address: string }, fromContract: { address: string }) {
  const code = await ethers.provider.getCode(fromContract.address);
  await setCodeTo(toContract, code);
}

export async function setCodeTo(contract: { address: string }, code: string) {
  await ethers.provider.send("hardhat_setCode", [contract.address, code]);
}

export async function setStorage(contract: { address: string }, location: string, value: string) {
  await ethers.provider.send("hardhat_setStorageAt", [contract.address, location, value]);
}
