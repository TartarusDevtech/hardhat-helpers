import { BigNumber, BigNumberish } from "ethers";
import { ethers } from "hardhat";

export async function increaseETHBalance(
  account: { address: string },
  amount: BigNumberish = ethers.utils.parseEther("1000")
) {
  const currentBalance = await ethers.provider.getBalance(account.address);
  const newBalance = currentBalance.add(amount);
  await setETHBalance(account, newBalance);
}

export async function setETHBalance(
  account: { address: string },
  newBalance: BigNumberish = ethers.utils.parseEther("1000")
) {
  const balance = ethers.utils.hexStripZeros(BigNumber.from(newBalance).toHexString());
  await ethers.provider.send("hardhat_setBalance", [account.address, balance]);
}
