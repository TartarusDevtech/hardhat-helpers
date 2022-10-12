import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { hasCode, snapshotEach } from "../../../src";
import { MockValue, MockValue__factory } from "../../typechain";

describe("storage / hasCode", () => {
  let mockValue: MockValue;
  let alice: SignerWithAddress;

  snapshotEach(async () => {
    [alice] = await ethers.getSigners();
    mockValue = await new MockValue__factory(alice).deploy();
  });

  it("EOA does not have code", async () => {
    expect(await hasCode(alice.address)).to.be.false;
  });

  it("Contract does have code", async () => {
    expect(await hasCode(mockValue.address)).to.be.true;
  });
});
