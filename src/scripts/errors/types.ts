export type CustomContractError = {
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

export type ContractDefinition = { abi: any; name: string };
