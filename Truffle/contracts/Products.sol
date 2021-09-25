// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;
import "./LoopToken.sol";

contract Products {
    uint32 public Count = 0;
    LoopToken public tokenContract;
    struct item {
        uint32 Id;
        address Owner;
        string ProductName;
        string descriptors;
        string ImgUrl;
        uint56 Price;
        bool SellAble;
    }
    mapping(uint32 => item) public items;

    event _AddProduct(
        uint32 indexed Id,
        address indexed Owner,
        string ProductName,
        string descriptors,
        string ImgUrl,
        uint56 Price,
        bool SellAble
    );

    event _BuyProduct(
        address indexed Seller,
        uint32 indexed Id,
        address indexed Buyer,
        string ProductName,
        string descriptors,
        string ImgUrl,
        uint56 Price,
        bool SellAble
    );

    event _ChangeProduct(
        uint32 indexed Id,
        address indexed Owner,
        string ProductName,
        string descriptors,
        string ImgUrl,
        uint56 Price,
        bool SellAble
    );
    event _DeleteProduct(uint32 Id, address Owner);

    constructor(LoopToken _tokenContract) {
        tokenContract = _tokenContract;
    }

    function AddProduct(
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
        items[id] = item(
            id,
            msg.sender,
            _productName,
            _descriptors,
            _ImgUrl,
            _Price,
            _SallAble
        );
        emit _AddProduct(
            id,
            msg.sender,
            _productName,
            _descriptors,
            _ImgUrl,
            _Price,
            _SallAble
        );
    }

    function BuyProduct(uint32 _productId) public {
        item storage selectedProduct = items[_productId];

        address ProductOwner = selectedProduct.Owner;
        require(
            selectedProduct.Owner != msg.sender,
            "product owner can't buy own Product"
        );
        require(selectedProduct.Id != 0, "product not exist");
        require(selectedProduct.SellAble, "product most sellAble");
        require(
            tokenContract.transferFrom(
                msg.sender,
                selectedProduct.Owner,
                selectedProduct.Price
            )
        );
        selectedProduct.Owner = msg.sender;
        selectedProduct.SellAble = false;
        items[_productId] = selectedProduct;
        emit _BuyProduct(
            ProductOwner,
            selectedProduct.Id,
            msg.sender,
            selectedProduct.ProductName,
            selectedProduct.descriptors,
            selectedProduct.ImgUrl,
            selectedProduct.Price,
            false
        );
    }

    function ChangeProduct(
        uint32 _productId,
        string memory _productName,
        string memory _descriptors,
        string memory _ImgUrl,
        uint56 _Price,
        bool _SallAble
    ) public {
        item memory selectedProduct = items[_productId];
        require(selectedProduct.Id != 0, "product not exist");
        require(msg.sender == selectedProduct.Owner);
        items[_productId] = item(
            selectedProduct.Id,
            selectedProduct.Owner,
            _productName,
            _descriptors,
            _ImgUrl,
            _Price,
            _SallAble
        );
        emit _ChangeProduct(
            selectedProduct.Id,
            selectedProduct.Owner,
            _productName,
            _descriptors,
            _ImgUrl,
            _Price,
            _SallAble
        );
    }

    function DeleteProduct(uint32 _productId) public {
        item memory selectedProduct = items[_productId];
        require(selectedProduct.Id != 0, "product not exist");
        require(msg.sender == selectedProduct.Owner);
        delete items[_productId];
        emit _DeleteProduct(_productId, msg.sender);
    }
}
