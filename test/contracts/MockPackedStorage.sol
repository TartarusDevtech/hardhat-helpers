// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

contract MockPackedStorage {
  address public addr;
  uint32 public u32;
  uint64 public u64;

  function set(address _addr, uint32 _u32, uint64 _u64) external {
    addr = _addr;
    u32 = _u32;
    u64 = _u64;
  }
}
