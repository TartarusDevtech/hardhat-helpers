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

export const ContractErrorsByName = {
  CustomErrors_Test_1: {
    contractName: "CustomErrors",
    name: "CustomErrors_Test_1",
    errorCode: "0x730b17c8",
    reason: "new reason",
    description: "new description",
  },
  CustomErrors_Test_2: {
    contractName: "CustomErrors",
    name: "CustomErrors_Test_2",
    errorCode: "0x11b1f88a",
    params: [
      { name: "a", type: "uint256" },
    ],
    reason: "reason added",
    description: "description added",
  },
  CustomErrors_Test_3: {
    contractName: "CustomErrors",
    name: "CustomErrors_Test_3",
    errorCode: "0x8b8a2201",
    params: [
      { name: "a", type: "uint256" },
      { name: "b", type: "address" },
    ],
  },
  CustomErrors_Test_4: {
    contractName: "CustomErrors2",
    name: "CustomErrors_Test_4",
    errorCode: "0xa2e67f32",
    params: [
      { name: "a", type: "uint256" },
      { name: "b", type: "uint256" },
      { name: "c", type: "uint256" },
    ],
  },
} as const;

export const ContractErrorsBySignature = {
  "0x730b17c8": {
    contractName: "CustomErrors",
    name: "CustomErrors_Test_1",
    errorCode: "0x730b17c8",
    reason: "new reason",
    description: "new description",
  },
  "0x11b1f88a": {
    contractName: "CustomErrors",
    name: "CustomErrors_Test_2",
    errorCode: "0x11b1f88a",
    params: [
      { name: "a", type: "uint256" },
    ],
    reason: "reason added",
    description: "description added",
  },
  "0x8b8a2201": {
    contractName: "CustomErrors",
    name: "CustomErrors_Test_3",
    errorCode: "0x8b8a2201",
    params: [
      { name: "a", type: "uint256" },
      { name: "b", type: "address" },
    ],
  },
  "0xa2e67f32": {
    contractName: "CustomErrors2",
    name: "CustomErrors_Test_4",
    errorCode: "0xa2e67f32",
    params: [
      { name: "a", type: "uint256" },
      { name: "b", type: "uint256" },
      { name: "c", type: "uint256" },
    ],
  },
} as const;
