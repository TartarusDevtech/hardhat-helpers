import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { getStorageAddress, getStorageNumber, snapshotEach } from "../../../src";
import { MockValue, MockValue__factory } from "../../typechain";

describe("storage / getStorage", () => {
  let mockValue: MockValue;
  let alice: SignerWithAddress;

  snapshotEach(async () => {
    [alice] = await ethers.getSigners();
    mockValue = await new MockValue__factory(alice).deploy();
  });

  describe("After setting uint storage", () => {
    snapshotEach(async () => {
      await mockValue.setNumber(42);
    });

    it("Has 42", async () => {
      const value = await getStorageNumber(mockValue, 0);
      expect(value).to.eq(42);
    });
  });

  describe("After setting address storage", () => {
    snapshotEach(async () => {
      await mockValue.setAddr(alice.address);
    });

    it("Has address", async () => {
      const value = await getStorageAddress(mockValue, 1);
      expect(value).to.eq(alice.address);
    });
  });

  describe("After setting address with leading zeros", () => {
    let address = "0x000000000000000000000000000000000000dEaD";

    snapshotEach(async () => {
      await mockValue.setAddr(address);
    });

    it("Has address", async () => {
      const value = await getStorageAddress(mockValue, 1);
      expect(value).to.eq(address);
    });
  });

  describe("After setting address with trailing zeros", () => {
    let address = "0xdEad000000000000000000000000000000000000";

    snapshotEach(async () => {
      await mockValue.setAddr(address);
    });

    it("Has address", async () => {
      const value = await getStorageAddress(mockValue, 1);
      expect(value).to.eq(address);
    });
  });
});
