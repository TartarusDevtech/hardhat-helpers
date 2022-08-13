import { expect } from "chai";
import { ethers } from "hardhat";
import { setStorage, snapshotEach } from "../../../src";
import { MockValue, MockValue__factory } from "../../typechain";

describe("storage / setStorage", () => {
  let mockValue: MockValue;

  snapshotEach(async () => {
    const [alice] = await ethers.getSigners();
    mockValue = await new MockValue__factory(alice).deploy();
  });

  it("Has 0 by default", async () => {
    expect(await mockValue.value()).to.eq(0);
  });

  describe("Can set the storage with hex values", () => {
    snapshotEach(async () => {
      await setStorage(mockValue, "0x0", "0x12");
    });

    it("Has 18", async () => {
      expect(await mockValue.value()).to.eq(18);
    });
  });

  describe("Can set the storage with number values", () => {
    snapshotEach(async () => {
      await setStorage(mockValue, 0, 42);
    });

    it("Has 42", async () => {
      expect(await mockValue.value()).to.eq(42);
    });
  });
});
