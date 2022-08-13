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
  let balance = ethers.utils.hexStripZeros(BigNumber.from(newBalance).toHexString());
  if (balance == "0x") {
    // When setting to 0, hexStripZeros returns 0x which would fail
    balance = "0x0";
  }
  await ethers.provider.send("hardhat_setBalance", [account.address, balance]);
}
