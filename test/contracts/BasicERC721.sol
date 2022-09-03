// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicERC721 is ERC721 {
  // solhint-disable-next-line no-empty-blocks
  constructor() ERC721("BasicERC721", "B721") {}

  function mint(address to, uint256 tokenId) public {
    _mint(to, tokenId);
  }
}
