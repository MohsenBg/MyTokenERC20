// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "./LoopToken.sol";

contract LoopTokenSale {
    address admin;
    LoopToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokenSold;

    event Sell(address _buyer, uint256 _amount);

    constructor(LoopToken _tokenContract, uint256 _tokenPrice) {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    //multiply
    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyToken(uint256 _numberOfToken) public payable {
        require(msg.value == multiply(_numberOfToken, tokenPrice));
        require(tokenContract.balanceOf(address(this)) >= _numberOfToken);
        require(tokenContract.transfer(msg.sender, _numberOfToken));
        tokenSold += _numberOfToken;
        emit Sell(msg.sender, _numberOfToken);
    }

    function endSale() public {
        require(msg.sender == admin);
        require(
            tokenContract.transfer(
                admin,
                tokenContract.balanceOf(address(this))
            )
        );
        //if want destoryed
        //destoryed contract solidity above 0.6.0
        selfdestruct(payable(msg.sender));
        //destoryed contract solidity 0.4.0 to 0.5.17.
        //selfdestruct(msg.sender);
    }
}
