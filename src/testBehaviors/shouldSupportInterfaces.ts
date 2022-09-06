// Originally from https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts-upgradeable/master/test/introspection/SupportsInterface.behavior.js
import { expect } from "chai";
import { Contract } from "ethers";
import { FunctionFragment } from "ethers/lib/utils";
import { ethers } from "hardhat";

export const INTERFACES: { [key: string]: string[] } = {};

// 165: Standard Interface Detection
register165Interface("ERC165", ["supportsInterface(bytes4)"], "0x01ffc9a7");

// 721: Non-Fungible Token Standard
register165Interface(
  "ERC721",
  [
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
  "0x80ac58cd"
);
register165Interface(
  "ERC721Enumerable",
  ["totalSupply()", "tokenOfOwnerByIndex(address,uint256)", "tokenByIndex(uint256)"],
  "0x780e9d63"
);
register165Interface("ERC721Metadata", ["name()", "symbol()", "tokenURI(uint256)"], "0x5b5e139f");
register165Interface("ERC721TokenReceiver", ["onERC721Received(address,address,uint256,bytes)"], "0x150b7a02");

// 1155: Multi Token Standard
register165Interface(
  "ERC1155",
  [
    "balanceOf(address,uint256)",
    "balanceOfBatch(address[],uint256[])",
    "setApprovalForAll(address,bool)",
    "isApprovedForAll(address,address)",
    "safeTransferFrom(address,address,uint256,uint256,bytes)",
    "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)",
  ],
  "0xd9b67a26"
);
register165Interface(
  "ERC1155TokenReceiver",
  [
    "onERC1155Received(address,address,uint256,uint256,bytes)",
    "onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)",
  ],
  "0x4e2312e0"
);
register165Interface("ERC1155Metadata_URI", ["uri(uint256)"], "0x0e89341c");

// 2981: NFT Royalty Standard
register165Interface("ERC2981", ["royaltyInfo(uint256,uint256)"], "0x2a55205a");

// 4907: Rental NFT, an Extension of EIP-721
register165Interface(
  "ERC4907",
  ["setUser(uint256,address,uint64)", "userOf(uint256)", "userExpires(uint256)"],
  "0xad092b5c"
);

// 5006: Rental NFT, NFT User Extension
register165Interface(
  "ERC5006",
  [
    "usableBalanceOf(address,uint256)",
    "frozenBalanceOf(address,uint256)",
    "userRecordOf(uint256)",
    "createUserRecord(address,address,uint256,uint64,uint64)",
    "deleteUserRecord(uint256)",
  ],
  "0xc26d96cc"
);

export function register165InterfaceFromContract(
  interfaceName: string,
  contract: { interface: { functions: { [functionSig: string]: FunctionFragment } } },
  expectedInterfaceId?: string
): void {
  register165Interface(interfaceName, Object.keys(contract.interface.functions), expectedInterfaceId);
}

export function register165InterfaceFromFactory(
  interfaceName: string,
  contract: { createInterface(): { functions: { [functionSig: string]: FunctionFragment } } },
  expectedInterfaceId?: string
): void {
  register165Interface(interfaceName, Object.keys(contract.createInterface().functions), expectedInterfaceId);
}

export function register165Interface(interfaceName: string, functions: string[], expectedInterfaceId?: string): void {
  const existingInterface = INTERFACES[interfaceName];
  if (existingInterface) {
    expect(JSON.stringify(functions.sort())).to.eq(
      JSON.stringify(INTERFACES[interfaceName].sort()),
      `Interface ${interfaceName} already registered with different functions`
    );
  }
  if (expectedInterfaceId) {
    const interfaceId = makeInterfaceId(functions);
    expect(interfaceId).to.eq(expectedInterfaceId, `Interface ${interfaceName} has unexpected interface ID`);
  }
  INTERFACES[interfaceName] = functions;
}

export function get165InterfaceId(interfaceName: string): string {
  const functions = INTERFACES[interfaceName];
  if (!functions) {
    throw new Error(`Interface ${interfaceName} not registered`);
  }
  return makeInterfaceId(functions);
}

export async function shouldSupport165Interfaces(
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
      true,
      `Does not claim support for "${interfaceName}" (${interfaceId})`
    );

    if (!supportedButNotRegistered) {
      for (const fnName of INTERFACES[interfaceName]) {
        expect(contract.functions[fnName]).not.to.eq(
          null,
          `${fnName} has to be implemented for ${interfaceName} (${interfaceId})`
        );
      }
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
