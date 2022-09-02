import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, BigNumberish } from "ethers";
import { ethers } from "hardhat";

import { increaseETHBalance, snapshotEach } from "../../../src";

describe("balance / increase", () => {
  let alice: SignerWithAddress;
  let balanceBefore: BigNumber;

  snapshotEach(async () => {
    [alice] = await ethers.getSigners();
    balanceBefore = await alice.getBalance();
  });

  shouldIncreaseBalance(ethers.utils.parseEther("1000"));
  shouldIncreaseBalance(ethers.utils.parseEther("42"));
  shouldIncreaseBalance(ethers.utils.parseEther("0.0001"));
  shouldIncreaseBalance(42);

  function shouldIncreaseBalance(amount: BigNumberish) {
    it(`Increase by ${amount.toLocaleString()}`, async () => {
      await increaseETHBalance(alice, amount);
      const balanceAfter = await alice.getBalance();
      expect(balanceAfter).to.eq(balanceBefore.add(amount));
    });
  }
});
