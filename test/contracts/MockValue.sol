// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

contract MockValue {
  uint256 public number;
  address public addr;

  function setNumber(uint256 _value) public {
    number = _value;
  }

  function setAddr(address _value) public {
    addr = _value;
  }
}
