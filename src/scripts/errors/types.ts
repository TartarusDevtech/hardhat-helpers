export type CustomContractError = {
  // Note: If there same error appears in multiple contracts, this field will be set to the first instance found.
  contractName: string;
  name: string;
  errorCode: string;
  params?: {
    name: string;
    type: string;
  }[];
};

export type ContractDefinition = { abi: any; name: string };
