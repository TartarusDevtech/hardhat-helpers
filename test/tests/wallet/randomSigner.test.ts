import { ethers } from "hardhat";

import { getRandomSigner, setETHBalance, snapshotEach } from "../../../src";
import { MockEvent, MockEvent__factory } from "../../typechain";

describe("wallet / randomSigner", () => {
  let mock: MockEvent;

  snapshotEach(async () => {
    const [deployer] = await ethers.getSigners();
    mock = await new MockEvent__factory(deployer).deploy();
  });

  it("Can sign with the value returned", async () => {
    const signer = getRandomSigner(2);
    await setETHBalance(signer);
    await mock.connect(signer).noop();
  });
});
