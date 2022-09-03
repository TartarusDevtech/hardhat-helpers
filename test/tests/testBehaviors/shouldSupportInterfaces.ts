import { expect } from "chai";
import { ethers } from "hardhat";

import { INTERFACES, shouldSupportInterfaces, snapshotEach } from "../../../src";
import { BasicERC721, BasicERC721__factory } from "../../typechain";

describe("testBehaviors / shouldSupportInterfaces", () => {
  let erc721: BasicERC721;

  snapshotEach(async () => {
    const [deployer] = await ethers.getSigners();
    erc721 = await new BasicERC721__factory(deployer).deploy();
  });

  it("Check interface", async () => {
    await shouldSupportInterfaces(erc721, "ERC721");
  });

  it("Check multiple interfaces", async () => {
    await shouldSupportInterfaces(erc721, ["ERC165", "ERC721"]);
  });

  it("Throws if the interface is unknown", async () => {
    await expect(shouldSupportInterfaces(erc721, "Unknown")).to.be.rejectedWith('Unknown interface "Unknown"');
  });

  it("Fails if the interface is not supported", async () => {
    await expect(shouldSupportInterfaces(erc721, "ERC2981")).to.be.rejectedWith('Does not claim support for "ERC2981"');
  });

  it("Can push new interfaces", async () => {
    INTERFACES["New"] = ["new()"];
    await expect(shouldSupportInterfaces(erc721, "New")).to.be.rejectedWith('Does not claim support for "New"');
  });
});
