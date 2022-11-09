// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

contract MockEvents {
  event Event();
  event Empty();
  event Uint(uint256 value);
  event String(string value);
  event Multiple(
    address indexed from,
    address indexed to,
    address indexed origin,
    uint256 value,
    string str,
    bytes data
  );

  function emitEmpty() public {
    emit Empty();
  }

  function emitUint(uint256 value) public {
    emit Uint(value);
  }

  function emitString(string calldata value) public {
    emit String(value);
  }

  function emitMultiple(
    address from,
    address to,
    address origin,
    uint256 value,
    string memory str,
    bytes memory data
  ) public {
    emit Multiple(from, to, origin, value, str, data);
  }
}
