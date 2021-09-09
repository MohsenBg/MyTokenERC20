// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;
import "./LoopToken.sol";

contract Products {
    address Admin;
    LoopToken public tokenContract;
    uint32 public Count = 0;
    struct item {
        uint32 Id;
        address Owner;
        string ProductName;
        string descriptors;
        string ImgUrl;
        uint56 Price;
    }
    mapping(address => mapping(uint32 => item)) public items;

    constructor(LoopToken _tokenContract) {
        Admin = msg.sender;
        tokenContract = _tokenContract;
    }

    function AddProducts(
        string memory _productName,
        string memory _descriptors,
        string memory _ImgUrl,
        uint56 _Price
    ) public {
        require(
            _Price > 0 && _Price <= 200000,
            "price can not more than 200000 or less than one"
        );
        Count++;
        uint32 id = Count;
        items[msg.sender][id] = item(
            id,
            msg.sender,
            _productName,
            _descriptors,
            _ImgUrl,
            _Price
        );
    }
}
