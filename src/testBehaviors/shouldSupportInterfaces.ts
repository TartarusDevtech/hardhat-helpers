// Originally from https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts-upgradeable/master/test/introspection/SupportsInterface.behavior.js
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

export const INTERFACES: { [key: string]: string[] } = {
  ERC165: ["supportsInterface(bytes4)"],
  ERC721: [
    "balanceOf(address)",
    "ownerOf(uint256)",
    "approve(address,uint256)",
    "getApproved(uint256)",
    "setApprovalForAll(address,bool)",
    "isApprovedForAll(address,address)",
    "transferFrom(address,address,uint256)",
    "safeTransferFrom(address,address,uint256)",
    "safeTransferFrom(address,address,uint256,bytes)",
  ],
  ERC721Enumerable: ["totalSupply()", "tokenOfOwnerByIndex(address,uint256)", "tokenByIndex(uint256)"],
  ERC721Metadata: ["name()", "symbol()", "tokenURI(uint256)"],
  ERC1155: [
    "balanceOf(address,uint256)",
    "balanceOfBatch(address[],uint256[])",
    "setApprovalForAll(address,bool)",
    "isApprovedForAll(address,address)",
    "safeTransferFrom(address,address,uint256,uint256,bytes)",
    "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)",
  ],
  ERC1155Receiver: [
    "onERC1155Received(address,address,uint256,uint256,bytes)",
    "onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)",
  ],
  ERC2981: ["royaltyInfo(uint256,uint256)"],
};

export async function shouldSupportInterfaces(
  contract: Contract,
  interfaces: string | string[],
  supportedButNotRegistered = false
): Promise<void> {
  const INTERFACE_IDS: { [key: string]: string } = {};
  for (const k of Object.getOwnPropertyNames(INTERFACES)) {
    INTERFACE_IDS[k] = makeInterfaceId(INTERFACES[k]);
  }

  if (typeof interfaces === "string") {
    // If checking a single interface, wrap it in an array
    interfaces = [interfaces];
  }

  if (!interfaces.includes("ERC165")) {
    // ERC165 is always required
    interfaces.unshift("ERC165");
  }

  for (const interfaceName of interfaces) {
    const interfaceId = INTERFACE_IDS[interfaceName];
    if (!interfaceId) {
      throw new Error(`Unknown interface "${interfaceName}"`);
    }
    expect(await contract.estimateGas.supportsInterface(interfaceId)).to.be.lte(
      32000,
      `${interfaceName} (${interfaceId}) uses more than 32k gas`
    );
    expect(await contract.supportsInterface(interfaceId)).to.equal(
      !supportedButNotRegistered,
      (supportedButNotRegistered ? "Unexpectedly claims support" : "Does not claim support") +
        ` for "${interfaceName}" (${interfaceId})`
    );

    for (const fnName of INTERFACES[interfaceName]) {
      expect(contract.functions[fnName]).not.to.eq(
        null,
        `${fnName} has to be implemented for ${interfaceName} (${interfaceId})`
      );
    }
  }
}

function makeInterfaceId(functionSignatures: string[]): string {
  const INTERFACE_ID_LENGTH = 4;

  const interfaceIdBuffer = functionSignatures
    .map((signature) => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(signature)))
    .map(
      (h) => Buffer.from(h.substring(2), "hex").slice(0, 4) // bytes4()
    )
    .reduce((memo, bytes) => {
      for (let i = 0; i < INTERFACE_ID_LENGTH; i++) {
        memo[i] = memo[i] ^ bytes[i]; // xor
      }
      return memo;
    }, Buffer.alloc(INTERFACE_ID_LENGTH));

  return `0x${interfaceIdBuffer.toString("hex")}`;
}
