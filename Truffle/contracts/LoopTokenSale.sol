// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "./LoopToken.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract LoopTokenSale {
    address admin;
    LoopToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokenSold;
    int256 public Mathtoken;
    AggregatorV3Interface internal priceFeed;

    event Sell(address indexed _buyer, uint256 _amount);

    constructor(
        LoopToken _tokenContract,
        uint256 _tokenPrice,
        int256 _Math
    ) {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
        Mathtoken = _Math;
        priceFeed = AggregatorV3Interface(
            0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        );
    }

    //multiply
    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyToken(uint256 _numberOfToken) public payable {
        require(msg.value == multiply(_numberOfToken, tokenPrice));
        require(tokenContract.balanceOf(address(this)) >= _numberOfToken);
        require(tokenContract.transfer(msg.sender, _numberOfToken));
        require(tokenSold <= 800000);
        tokenSold += _numberOfToken;
        assert(tokenSold <= 800000);
        emit Sell(msg.sender, _numberOfToken);
    }

    // eth price
    function usdPrice() public view returns (int256) {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return (price / Mathtoken);
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
