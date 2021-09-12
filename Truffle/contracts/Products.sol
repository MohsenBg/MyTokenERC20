// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;
import "./LoopToken.sol";

contract Products is LoopToken {
    address Admin;
    uint32 public Count = 0;
    struct item {
        uint32 Id;
        address Owner;
        string ProductName;
        string descriptors;
        string ImgUrl;
        uint56 Price;
        bool SellAble;
    }
    mapping(address => mapping(uint32 => item)) public items;

    constructor() LoopToken(2000000) {
        Admin = msg.sender;
    }

    function AddProducts(
        string memory _productName,
        string memory _descriptors,
        string memory _ImgUrl,
        uint56 _Price,
        bool _SallAble
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
            _Price,
            _SallAble
        );
    }

    function BuyProduct(address _productOwner, uint32 _productId) public {
        item memory selectedProduct = items[_productOwner][_productId];
        require(
            _productOwner != msg.sender,
            "product owner can't buy own Product"
        );
        require(selectedProduct.Price != 0, "product not exist");
        require(selectedProduct.SellAble, "product most sellAble");
        require(transfer(_productOwner, selectedProduct.Price));
        delete items[_productOwner][_productId];
        items[msg.sender][_productId] = selectedProduct;
    }
}
