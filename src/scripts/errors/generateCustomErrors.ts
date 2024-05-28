import { artifacts, ethers } from "hardhat";

import { ContractDefinition, CustomContractError } from "./types";

type CustomErrorFileOptions = {
  keyBy: "errorName" | "errorCode";
};

export type FieldRequirement = "Optional" | "Warn" | "Error";

type CommentOptions = {
  reasonRequirement?: FieldRequirement;
  descriptionRequirement?: FieldRequirement;
  commentOverrides?: {
    [errorName: string]: {
      reason: string;
      description: string;
    };
  };
};

export function generateCustomErrorsFile(contracts: ContractDefinition[], options?: CommentOptions): string {
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
  reason${options?.reasonRequirement === undefined || options.reasonRequirement === "Optional" ? "?" : ""}: string;
  description${options?.descriptionRequirement === undefined || options.descriptionRequirement === "Optional" ? "?" : ""}: string;
};

export const ContractErrorsByName = {
`;
  for (const error of allCustomErrors) {
    file += dumpError(error, { keyBy: "errorName", ...options });
  }
  file += `} as const;

export const ContractErrorsBySignature = {
`;
  for (const error of allCustomErrors) {
    file += dumpError(error, { keyBy: "errorCode", ...options });
  }
  file += `} as const;\n`;
  return file;
}

function loadCustomErrors(contract: ContractDefinition): CustomContractError[] {
  const customErrors: CustomContractError[] = [];
  const contractName = contract.name.substring(0, contract.name.length - 9); // Remove "__factory" from the end

  const artifact = artifacts.readArtifactSync(contractName);
  const buildInfo = artifacts.getBuildInfoSync(`${artifact.sourceName}:${artifact.contractName}`);
  const metadataOutput = JSON.parse(
    (buildInfo?.output.contracts[artifact.sourceName][artifact.contractName] as any).metadata
  ).output;

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

function dumpError(error: CustomContractError, options: CustomErrorFileOptions & CommentOptions): string {
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

  const reason = (options.commentOverrides && options.commentOverrides[error.name]?.reason) || error.reason;
  if (reason) {
    results += `    reason: "${reason}",\n`;
  } else if (options.reasonRequirement === "Warn") {
    results += `    reason: "${error.name}",\n`;
    console.warn(`Reason is required for error: ${error.name}`);
  } else if (options.reasonRequirement === "Error") {
    throw new Error(`Reason is required for error: ${error.name}`);
  }

  const description =
    (options.commentOverrides && options.commentOverrides[error.name]?.description) || error.description;
  if (description) {
    results += `    description: "${description}",\n`;
  } else if (options.descriptionRequirement === "Warn") {
    results += `    description: "${error.name}",\n`;
    console.warn(`Description is required for error: ${error.name}`);
  } else if (options.descriptionRequirement === "Error") {
    throw new Error(`Description is required for error: ${error.name}`);
  }

  results += `  },\n`;
  return results;
}
