// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

contract CustomErrorsWithConflict {
  // Conflict: same name as in `CustomErrors` but w/ diff params
  error CustomErrors_Test_3(uint256 a);

  function error(uint256 test) public pure {
    if (test == 2) {
      revert CustomErrors_Test_3(1);
    }
  }
}
