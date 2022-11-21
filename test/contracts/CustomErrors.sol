// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

contract CustomErrors {
  error CustomErrors_Test_1();
  error CustomErrors_Test_2(uint256 a);
  error CustomErrors_Test_3(uint256 a, uint256 b);

  uint private counter;

  function error(uint test) public {
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
