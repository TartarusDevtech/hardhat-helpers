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

export const ContractErrorsByName: { [errorName: string]: CustomContractError } = {
  CustomErrors_Test_1: {
    contractName: "CustomErrors",
    name: "CustomErrors_Test_1",
    errorCode: "0x730b17c8",
  },
  CustomErrors_Test_2: {
    contractName: "CustomErrors",
    name: "CustomErrors_Test_2",
    errorCode: "0x11b1f88a",
    params: [
      { name: "a", type: "uint256" },
    ],
  },
  CustomErrors_Test_3: {
    contractName: "CustomErrors",
    name: "CustomErrors_Test_3",
    errorCode: "0xd3c4fb90",
    params: [
      { name: "a", type: "uint256" },
      { name: "b", type: "uint256" },
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
};

export const ContractErrorsBySignature: { [errorCode: string]: CustomContractError } = {
  0x730b17c8: {
    contractName: "CustomErrors",
    name: "CustomErrors_Test_1",
    errorCode: "0x730b17c8",
  },
  0x11b1f88a: {
    contractName: "CustomErrors",
    name: "CustomErrors_Test_2",
    errorCode: "0x11b1f88a",
    params: [
      { name: "a", type: "uint256" },
    ],
  },
  0xd3c4fb90: {
    contractName: "CustomErrors",
    name: "CustomErrors_Test_3",
    errorCode: "0xd3c4fb90",
    params: [
      { name: "a", type: "uint256" },
      { name: "b", type: "uint256" },
    ],
  },
  0xa2e67f32: {
    contractName: "CustomErrors2",
    name: "CustomErrors_Test_4",
    errorCode: "0xa2e67f32",
    params: [
      { name: "a", type: "uint256" },
      { name: "b", type: "uint256" },
      { name: "c", type: "uint256" },
    ],
  },
};
