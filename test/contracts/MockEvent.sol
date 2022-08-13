// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

contract MockEvent {
  event Event();

  function noop() public {}

  function emitEvent() public {
    emit Event();
  }
}
