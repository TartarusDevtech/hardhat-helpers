import { BigNumberish } from "ethers";
import { ethers } from "hardhat";

import { setETHBalance } from "../balance";
import { impersonate } from "../fork";
import { Usdc__factory } from "../typechain";

const contractAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
// masterMinter has permission to mint
const masterMinterAddress = "0xE982615d461DD5cD06575BbeA87624fda4e3de17 ";

export const usdc = Usdc__factory.connect(contractAddress, ethers.provider);

export async function mintUsdc(account: { address: string }, amount: BigNumberish = ethers.utils.parseEther("1000")) {
  const minter = await impersonate(masterMinterAddress);
  await setETHBalance(minter);
  await usdc.connect(minter).mint(account.address, amount);
}
