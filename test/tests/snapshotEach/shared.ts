import { ethers } from "hardhat";
import { snapshotEach } from "../../../src";
import { MockValue, MockValue__factory } from "../../typechain";

let deployCounter = 0;
export let mock: MockValue;

snapshotEach(async () => {
  console.log(`Deploying MockValue#${deployCounter}`);
  const [deployer] = await ethers.getSigners();
  mock = await new MockValue__factory(deployer).deploy();
  if (++deployCounter != 1) {
    throw new Error("deployCounter != 1");
  }
});
