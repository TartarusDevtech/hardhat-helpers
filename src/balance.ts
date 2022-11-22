import { BigNumber, BigNumberish } from "ethers";
import { ethers } from "hardhat";

import { AddressLike, toAddress } from "./types";

export const ONE_ETH = ethers.utils.parseEther("1");

export async function increaseETHBalance(account: AddressLike, amount: BigNumberish = ONE_ETH.mul(1000)) {
  const currentBalance = await ethers.provider.getBalance(toAddress(account));
  const newBalance = currentBalance.add(amount);
  await setETHBalance(account, newBalance);
}

export async function setETHBalance(account: AddressLike, newBalance: BigNumberish = ONE_ETH.mul(1000)) {
  let balance = ethers.utils.hexStripZeros(BigNumber.from(newBalance).toHexString());
  if (balance == "0x") {
    // When setting to 0, hexStripZeros returns 0x which would fail
    balance = "0x0";
  }
  await ethers.provider.send("hardhat_setBalance", [toAddress(account), balance]);
}
