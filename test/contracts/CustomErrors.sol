// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

contract CustomErrors {
  /**
   * @notice Test custom error 1
   * @dev This is a test function to check the output of custom error 1
   */
  error CustomErrors_Test_1();
  error CustomErrors_Test_2(uint256 a);
  error CustomErrors_Test_3(uint256 a, uint256 b);

  uint256 private counter;

  function error(uint256 test) public {
    if (test == 0) {
      revert CustomErrors_Test_1();
    } else if (test == 1) {
      revert CustomErrors_Test_2(1);
    } else if (test == 2) {
      revert CustomErrors_Test_3(1, 2);
    }
    counter++;
  }
}
