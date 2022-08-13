import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumberish } from "ethers";
import { ethers } from "hardhat";
import { setETHBalance, snapshotEach } from "../../../src";

describe("balance / set", () => {
  let alice: SignerWithAddress;

  snapshotEach(async () => {
    [alice] = await ethers.getSigners();
  });

  shouldSetBalance(ethers.utils.parseEther("1000"));
  shouldSetBalance(ethers.utils.parseEther("42"));
  shouldSetBalance(ethers.utils.parseEther("0.0001"));
  shouldSetBalance(42);
  shouldSetBalance(0);

  function shouldSetBalance(amount: BigNumberish) {
    it(`Set to ${amount.toLocaleString()}`, async () => {
      await setETHBalance(alice, amount);
      const balanceAfter = await alice.getBalance();
      expect(balanceAfter).to.eq(amount);
    });
  }
});
