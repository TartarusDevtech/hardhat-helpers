import { expect } from "chai";
import { ethers } from "hardhat";

import { get165InterfaceId, INTERFACES, shouldSupport165Interfaces, snapshotEach } from "../../../src";
import { BasicERC721, BasicERC721__factory, MockERC4906, MockERC4906__factory } from "../../typechain";

describe("testBehaviors / shouldSupportInterfaces", () => {
  let erc721: BasicERC721;
  let mockERC4906: MockERC4906;

  snapshotEach(async () => {
    const [deployer] = await ethers.getSigners();
    erc721 = await new BasicERC721__factory(deployer).deploy();
    mockERC4906 = await new MockERC4906__factory(deployer).deploy();
  });

  it("Check interface", async () => {
    await shouldSupport165Interfaces(erc721, "ERC721");
  });

  it("Check multiple interfaces", async () => {
    await shouldSupport165Interfaces(erc721, ["ERC165", "ERC721"]);
  });

  it("Throws if the interface is unknown", async () => {
    await expect(shouldSupport165Interfaces(erc721, "Unknown")).to.be.rejectedWith('Unknown interface "Unknown"');
  });

  it("Fails if the interface is not supported", async () => {
    await expect(shouldSupport165Interfaces(erc721, "ERC2981")).to.be.rejectedWith(
      'Does not claim support for "ERC2981"'
    );
  });

  it("Can push new interfaces", async () => {
    INTERFACES["New"] = ["new()"];
    await expect(shouldSupport165Interfaces(erc721, "New")).to.be.rejectedWith('Does not claim support for "New"');
  });

  it("Can get interfaceId", async () => {
    const interfaceId = get165InterfaceId("ERC721");
    expect(interfaceId).to.eq("0x80ac58cd");
  });

  it("Custom 4906 interface is registered", async () => {
    await shouldSupport165Interfaces(mockERC4906, "ERC4906");
  });
});
