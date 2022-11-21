export type CustomContractError = {
  name: string;
  errorCode: string;
  params?: {
    name: string;
    type: string;
  }[];
};

export const ContractErrors: { [errorCode: string]: CustomContractError } = {
  0x730b17c8: {
    name: "CustomErrors_Test_1",
    errorCode: "0x730b17c8",
  },
  0x11b1f88a: {
    name: "CustomErrors_Test_2",
    errorCode: "0x11b1f88a",
    params: [{ name: "a", type: "uint256" }],
  },
  0xd3c4fb90: {
    name: "CustomErrors_Test_3",
    errorCode: "0xd3c4fb90",
    params: [
      { name: "a", type: "uint256" },
      { name: "b", type: "uint256" },
    ],
  },
  0xa2e67f32: {
    name: "CustomErrors_Test_4",
    errorCode: "0xa2e67f32",
    params: [
      { name: "a", type: "uint256" },
      { name: "b", type: "uint256" },
      { name: "c", type: "uint256" },
    ],
  },
};
