import { expect } from "chai";
import { ethers } from "hardhat";

import { snapshotEach } from "../../../../src";
import { CustomErrors, CustomErrors__factory } from "../../../typechain";
import { expectError } from "./expectedOutput/testHelpers";

describe("scripts / generateCustomErrors / useTestHelpers", () => {
  let contract: CustomErrors;

  snapshotEach(async () => {
    const [deployer] = await ethers.getSigners();
    contract = await new CustomErrors__factory(deployer).deploy();
  });

  it("Catches revert", async () => {
    const tx = contract.error(0);
    await expectError.CustomErrors_Test_1(tx);
  });

  it("Does not catch incorrect revert reason", async () => {
    const tx = contract.error(0);
    await expect(expectError.CustomErrors_Test_2(tx, 1)).to.be.rejectedWith(
      "Expected transaction to be reverted with custom error 'CustomErrors_Test_2', but it reverted with custom error 'CustomErrors_Test_1'"
    );
  });

  it("Catches revert with param", async () => {
    const tx = contract.error(2);
    await expectError.CustomErrors_Test_3(tx, 1, 2);
  });
});
