import { expect } from "chai";

import { compute1167Create2Address } from "../../../src";

describe("Create2 / compute1167Create2Address", () => {
  it("Predicts the correct proxy address", async () => {
    // Testing using a known example from prod: 0xc44053f444afb96b31bfc65e1e5d68c85ef0934dbd49bdf3ae953b1014ec7295
    const factory = { address: "0x612E2DadDc89d91409e40f946f9f7CfE422e777E" };
    const implementation = { address: "0xF61f4F2c896219A90670e19E188eBb93FCc002E8" };
    const creator = { address: "0x57ccCDa8A7606d9cb685e11340F61dd9e4427BBC" };
    const nonce = 4584159680908344;
    const salt = creator.address + nonce.toString(16).padStart(24, "0");
    const expected = "0x5B7bA30f773BADb7C07BA38B44EB26C736248479";
    const computed = compute1167Create2Address(factory, implementation, salt);
    expect(computed).to.eq(expected);
  });
});
