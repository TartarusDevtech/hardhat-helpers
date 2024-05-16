import { artifacts, ethers } from "hardhat";

import { ContractDefinition, CustomContractError } from "./types";

type CustomErrorFileOptions = {
  keyBy: "errorName" | "errorCode";
};

export function generateCustomErrorsFile(contracts: ContractDefinition[]): string {
  // Gather the custom errors from each input contract and de-dupe entries.
  const allCustomErrors: CustomContractError[] = [];
  for (const contract of contracts) {
    const errors = loadCustomErrors(contract);
    for (const error of errors) {
      // Skip dupes by error code
      if (allCustomErrors.find((e) => e.errorCode === error.errorCode)) continue;
      // If still duped by name, throw since it could break the output file
      if (allCustomErrors.find((e) => e.name === error.name)) throw new Error(`Duplicate error name: ${error.name}`);
      allCustomErrors.push(error);
    }
  }

  // Sort by error name
  allCustomErrors.sort((a, b) => a.name.localeCompare(b.name));

  // Generate the file
  let file = `export type CustomContractError = {
  // Note: If there same error appears in multiple contracts, this field will be set to the first instance found.
  contractName: string;
  name: string;
  errorCode: string;
  params?: readonly {
    name: string;
    type: string;
  }[];
  reason?: string;
  description?: string;
};

export const ContractErrorsByName = {
`;
  for (const error of allCustomErrors) {
    file += dumpError(error, { keyBy: "errorName" });
  }
  file += `} as const;

export const ContractErrorsBySignature = {
`;
  for (const error of allCustomErrors) {
    file += dumpError(error, { keyBy: "errorCode" });
  }
  file += `} as const;\n`;
  return file;
}

function loadCustomErrors(contract: ContractDefinition): CustomContractError[] {
  const customErrors: CustomContractError[] = [];
  const contractName = contract.name.substring(0, contract.name.length - 9); // Remove "__factory" from the end

  const artifact = artifacts.readArtifactSync(contractName)
  const buildInfo = artifacts.getBuildInfoSync(`${artifact.sourceName}:${artifact.contractName}`)
  const metadataOutput = JSON.parse((buildInfo?.output.contracts[artifact.sourceName][artifact.contractName] as any).metadata).output;
  
  for (const entry of contract.abi) {
    if (entry.type !== "error") continue;
    const errorFragment = ethers.utils.ErrorFragment.from(entry);
    const errorSignature = errorFragment.format("sighash");
    customErrors.push({
      contractName,
      name: errorFragment.name,
      errorCode: ethers.utils.id(errorSignature).substring(0, 10),
      params: errorFragment.inputs,
      reason: metadataOutput.userdoc.errors?.[errorSignature]?.[0]?.notice,
      description: metadataOutput.devdoc.errors?.[errorSignature]?.[0]?.details,
    });
  }

  return customErrors;
}

function dumpError(error: CustomContractError, options: CustomErrorFileOptions): string {
  let results = `  ${options.keyBy === "errorName" ? error.name : `"${error.errorCode}"`}: {
    contractName: "${error.contractName}",
    name: "${error.name}",
    errorCode: "${error.errorCode}",
`;
  if (error.params && error.params.length > 0) {
    results += `    params: [\n`;
    for (const param of error.params) {
      results += `      { name: "${param.name}", type: "${param.type}" },\n`;
    }
    results += `    ],\n`;
  }
  if(error.reason) {
    results += `    reason: "${error.reason}",\n`;
  }
  if(error.description) {
    results += `    description: "${error.description}",\n`;
  }

  results += `  },\n`;
  return results;
}
