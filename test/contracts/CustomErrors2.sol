// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

contract CustomErrors2 {
  // Dupes:
  error CustomErrors_Test_1();
  error CustomErrors_Test_2(uint256 a);

  // New entry
  error CustomErrors_Test_4(uint256 a, uint256 b, uint256 c);

  function error(uint256 test) public pure {
    if (test == 0) {
      revert CustomErrors_Test_1();
    } else if (test == 1) {
      revert CustomErrors_Test_2(1);
    } else if (test == 2) {
      revert CustomErrors_Test_4(1, 2, 4);
    }
  }
}
