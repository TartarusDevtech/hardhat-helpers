// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

contract MockValue {
  uint256 public value;

  function set(uint256 _value) public {
    value = _value;
  }
}
