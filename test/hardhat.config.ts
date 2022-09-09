import "@nomicfoundation/hardhat-toolbox";

import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  paths: {
    tests: "./tests",
    artifacts: "./generated/artifacts/hardhat",
    cache: "./generated/cache",
    sources: "./contracts",
  },
  solidity: "0.8.17",
  typechain: {
    outDir: "./typechain",
  },
};

export default config;
