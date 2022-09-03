// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

contract Multicall {
  struct Call {
    address to;
    bytes data;
  }

  function call(Call[] calldata calls) external {
    for (uint256 i = 0; i < calls.length; ++i) {
      Call calldata c = calls[i];
      // solhint-disable-next-line avoid-low-level-calls
      (bool success, ) = c.to.call(c.data);
      require(success, "call failed");
    }
  }
}
