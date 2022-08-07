import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, network } from "hardhat";

export async function forkFromBlock(jsonRpcUrl: string, blockNumber: number | "latest" = "latest") {
  await network.provider.request({
    method: "hardhat_reset",
    params: [
      {
        forking: {
          jsonRpcUrl,
          blockNumber,
        },
      },
    ],
  });
}

export async function impersonate(address: string): Promise<SignerWithAddress> {
  const signer = await ethers.getSigner(address);
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [signer.address],
  });
  return signer;
}
