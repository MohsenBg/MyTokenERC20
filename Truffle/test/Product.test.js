const assert = require("assert");
const truffleAssertions = require("truffle-assertions");

contract("Product", (accounts) => {
  const Products = artifacts.require("Products");
  const LoopToken = artifacts.require('LoopToken')
  const Admin = accounts[0];
  const member = accounts[1];
  before(async () => {
    this.products = await Products.deployed();
    this.LoopToken = await LoopToken.deployed();
  });
  it("success deployed", async () => {
    const address = await this.products.address;
    assert.notStrictEqual(address, undefined, "address undefined");
    assert.notStrictEqual(address, "", "address is empty string");
    assert.notStrictEqual(
      address,
      "0x0000000000000000000000000000000000000000",
      "address has 0x0"
    );
    assert.notStrictEqual(address, null, "address is null");
  });
  it("AddProduct", async () => {
    //fist product Admin
    await this.products.AddProduct(
      "book",
      "good Book",
      "https://bookImg.png",
      50,
      true,
      { from: Admin }
    );
    let Count = await this.products.Count();
    let Item = await this.products.items(Count.toNumber());
    let Id = await Item.Id;
    let Owner = await Item.Owner;
    let ProductName = await Item.ProductName;
    let descriptors = await Item.descriptors;
    let ImgUrl = await Item.ImgUrl;
    let Price = await Item.Price;
    let SellAble = await Item.SellAble;
    assert.strictEqual(Id.toNumber(), Count.toNumber(), "check Id");
    assert.strictEqual(Owner, Admin, "check address");
    assert.strictEqual(ProductName, "book", "check productName");
    assert.strictEqual(descriptors, "good Book", "check descriptors");
    assert.strictEqual(ImgUrl, "https://bookImg.png", "check ImgUrl");
    assert.strictEqual(Price.toNumber(), 50, "check Price");
    assert.strictEqual(SellAble, true, "check SellAble");
    //second product admin
    await this.products.AddProduct(
      "desk",
      "bad desk",
      "https://deskImg.png",
      10,
      false,
      { from: Admin }
    );
    Count = await this.products.Count();
    Item = await this.products.items( Count.toNumber());
    Id = await Item.Id;
    Owner = await Item.Owner;
    ProductName = await Item.ProductName;
    descriptors = await Item.descriptors;
    ImgUrl = await Item.ImgUrl;
    Price = await Item.Price;
    SellAble = await Item.SellAble;
    assert.strictEqual(Id.toNumber(), Count.toNumber(), "check Id");
    assert.strictEqual(Owner, Admin, "check address");
    assert.strictEqual(ProductName, "desk", "check productName");
    assert.strictEqual(descriptors, "bad desk", "check descriptors");
    assert.strictEqual(ImgUrl, "https://deskImg.png", "check ImgUrl");
    assert.strictEqual(Price.toNumber(), 10, "check Price");
    assert.strictEqual(SellAble, false, "check SellAble");

    //fist member product
    const AddProduct = await this.products.AddProduct(
      "car",
      "fast car",
      "https://carImg.png",
      150000,
      true,
      { from: member }
    );
    await AddProduct;
    Count = await this.products.Count();
    Item = await this.products.items( Count.toNumber());
    Id = await Item.Id;
    Owner = await Item.Owner;
    ProductName = await Item.ProductName;
    descriptors = await Item.descriptors;
    ImgUrl = await Item.ImgUrl;
    Price = await Item.Price;
    SellAble = await Item.SellAble;

    assert.strictEqual(Id.toNumber(), Count.toNumber(), "check Id");
    assert.strictEqual(Owner, member, "check address");
    assert.strictEqual(ProductName, "car", "check productName");
    assert.strictEqual(descriptors, "fast car", "check descriptors");
    assert.strictEqual(ImgUrl, "https://carImg.png", "check ImgUrl");
    assert.strictEqual(Price.toNumber(), 150000, "check Price");
    assert.strictEqual(SellAble, true, "check SellAble");
    await truffleAssertions.reverts(
      this.products.AddProduct(
        "car",
        "fast car",
        "https://carImg.png",
        250000,
        { from: member }
      )
    );
  
  //!event
  
  const event = await AddProduct.logs;
  
    assert.strictEqual(
       event.length,
       1,
       " one event should exist "
     );
  
     assert.strictEqual(event[0].event, "_AddProduct", "event: select incorrect event");
     
     assert.strictEqual(
       event[0].args.Id.toNumber(),
       3,
       "event: select incorrect Id "
     );

     assert.strictEqual(
      event[0].args.Owner,
      member,
      "event: select incorrect OwnerProduct"
    );

    assert.strictEqual(
      event[0].args.ProductName,
      "car",
      "event: select incorrect ProductName"
    );

    assert.strictEqual(
      event[0].args.descriptors,
      'fast car',
      "event: select incorrect descriptors"
    );

    assert.strictEqual(
      event[0].args.ImgUrl,
      'https://carImg.png',
      "event: select incorrect Id "
    );

    assert.strictEqual(
      event[0].args.Price.toNumber(),
      150000,
      "event: select incorrect Price"
    );
  
    assert.strictEqual(
      event[0].args.SellAble,
      true,
      "event: product should be SellAble "
    );

  });
  it('buyProduct',async()=>{
    await truffleAssertions.reverts(this.products.BuyProduct(10,{from:Admin}))
    await truffleAssertions.reverts(this.products.BuyProduct(2,{from:member}))
   const approve = await this.LoopToken.approve(this.products.address,150000);
   await approve; 
   let allowance = await this.LoopToken.allowance(Admin,this.products.address);
   assert.strictEqual(allowance.toNumber(),150000,"check approve")
   const BuyProduct = await this.products.BuyProduct(3,{from:Admin});
    await BuyProduct;
     allowance = await this.LoopToken.allowance(Admin,this.products.address);
   assert.strictEqual(allowance.toNumber(),0,"check approve")
    let Item = await this.products.items(3);
    let Owner = await Item.Owner;
    assert.strictEqual(Owner,Admin,"products Owner most be Admin")
    let balance = await this.LoopToken.balanceOf(Admin);
    assert.strictEqual(balance.toNumber(),1850000,"balance of Admin");
    let Id = await Item.Id;
    assert.strictEqual(Id.toNumber(),3,"products id should 3")
    balance = await this.LoopToken.balanceOf(member);
    assert.strictEqual(balance.toNumber(),150000,"balance of member");
    assert.strictEqual(Item.SellAble,false,"products shouldn't sellAble")


    //!event

    const eventApproval = await approve.logs;
    assert.strictEqual(
      eventApproval.length,
       1,
       " one event should exist Approval"
     );

    const eventBuyProduct = await BuyProduct.logs;
    assert.strictEqual(
      eventBuyProduct.length,
       1,
       " one event should exist _BuyProducts "
     );

 

    //* first event (Approval)

    assert.strictEqual(
      eventApproval[0].event,
      "Approval",
      "event: select incorrect event"
    );

    assert.strictEqual(
      eventApproval[0].args._owner,
      Admin,
      "event: select incorrect account for send value"
    );

    assert.strictEqual(
      eventApproval[0].args._spender,
      this.products.address,
      "event: select incorrect account for receive value"
    );

    assert.strictEqual(
      eventApproval[0].args._value.toNumber(),
      150000,
      "event: select incorrect account for receive value"
    );

    //* second event

     assert.strictEqual(eventBuyProduct[0].event, "_BuyProduct", "event: select incorrect event");
     
     assert.strictEqual(
      eventBuyProduct[0].args.Buyer,
      Admin,
      "event: select incorrect Buyer of Product"
    );

     assert.strictEqual(
      eventBuyProduct[0].args.Id.toNumber(),
       3,
       "event: select incorrect Id "
     );

     assert.strictEqual(
      eventBuyProduct[0].args.Seller,
      member,
      "event: select incorrect seller of Product"
    );

    assert.strictEqual(
      eventBuyProduct[0].args.ProductName,
      "car",
      "event: select incorrect ProductName"
    );

    assert.strictEqual(
      eventBuyProduct[0].args.descriptors,
      'fast car',
      "event: select incorrect descriptors"
    );

    assert.strictEqual(
      eventBuyProduct[0].args.ImgUrl,
      'https://carImg.png',
      "event: select incorrect Id "
    );

    assert.strictEqual(
      eventBuyProduct[0].args.Price.toNumber(),
      150000,
      "event: select incorrect Price"
    );

    assert.strictEqual(
      eventBuyProduct[0].args.SellAble,
      false,
      "event: product should be SellAble "
    );
  })
  it("ChangeProduct", async ()=>{
    await truffleAssertions.reverts(this.products.ChangeProduct(5,"BigCar","fast very fast","https/:/Image.fastCar.png",180000,true,{from:Admin}))
    await truffleAssertions.reverts(this.products.ChangeProduct(3,"BigCar","fast very fast","https/:/Image.fastCar.png",180000,true,{from:member}))
    const ChangeProducts = await this.products.ChangeProduct(3,"BigCar","fast very fast","https/:/Image.fastCar.png",180000,true,{from:Admin});
    await ChangeProducts;
    let Item = await this.products.items(3);
    let Id = await Item.Id;
    let Owner = await Item.Owner;
    let ProductName = await Item.ProductName;
    let descriptors = await Item.descriptors;
    let ImgUrl = await Item.ImgUrl;
    let Price = await Item.Price;
    let SellAble = await Item.SellAble;
    assert.strictEqual(Id.toNumber(), 3, "check Id");
    assert.strictEqual(Owner, Admin, "check address");
    assert.strictEqual(ProductName, "BigCar", "check productName");
    assert.strictEqual(descriptors, "fast very fast", "check descriptors");
    assert.strictEqual(ImgUrl, "https/:/Image.fastCar.png", "check ImgUrl");
    assert.strictEqual(Price.toNumber(), 180000, "check Price");
    assert.strictEqual(SellAble, true, "check SellAble");
  
  //!event
  
  const event = await ChangeProducts.logs;
  
    assert.strictEqual(
       event.length,
       1,
       " one event should exist "
     );
     
  
     assert.strictEqual(event[0].event, "_ChangeProduct", "event: select incorrect event");
     
     assert.strictEqual(
       event[0].args.Id.toNumber(),
       3,
       "event: select incorrect Id "
     );

     assert.strictEqual(
      event[0].args.Owner,
      Admin,
      "event: select incorrect OwnerProduct"
    );

    assert.strictEqual(
      event[0].args.ProductName,
      "BigCar",
      "event: select incorrect ProductName"
    );

    assert.strictEqual(
      event[0].args.descriptors,
      'fast very fast',
      "event: select incorrect descriptors"
    );

    assert.strictEqual(
      event[0].args.ImgUrl,
      'https/:/Image.fastCar.png',
      "event: select incorrect Id "
    );

    assert.strictEqual(
      event[0].args.Price.toNumber(),
      180000,
      "event: select incorrect Price"
    );
  
    assert.strictEqual(
      event[0].args.SellAble,
      true,
      "event: product should be SellAble "
    );
  })
  it('DeleteProduct',async()=>{
    await truffleAssertions.reverts(this.products.DeleteProduct(5,{from:Admin}))
    await truffleAssertions.reverts(this.products.DeleteProduct(3,{from:member}))
    const DeleteProducts = await this.products.DeleteProduct(3,{from:Admin})
    await DeleteProducts;
    let Item = await this.products.items(3);
    let Id = await Item.Id;
    let Owner = await Item.Owner;
    let ProductName = await Item.ProductName;
    let descriptors = await Item.descriptors;
    let ImgUrl = await Item.ImgUrl;
    let Price = await Item.Price;
    let SellAble = await Item.SellAble;
    assert.strictEqual(Id.toNumber(), 0, "check Id");
    assert.strictEqual(Owner, "0x0000000000000000000000000000000000000000", "check address");
    assert.strictEqual(ProductName, "", "check productName");
    assert.strictEqual(descriptors, "", "check descriptors");
    assert.strictEqual(ImgUrl, "", "check ImgUrl");
    assert.strictEqual(Price.toNumber(), 0, "check Price");
    assert.strictEqual(SellAble, false, "check SellAble");
  
      //!event
  
  const event = await DeleteProducts.logs;
  
  assert.strictEqual(
     event.length,
     1,
     " one event should exist "
   );
 
   assert.strictEqual(event[0].event, "_DeleteProduct", "event: select incorrect event");
  
   assert.strictEqual(
     event[0].args.Id.toNumber(),
     3,
     "event: select incorrect Id "
   );
  
   assert.strictEqual(
    event[0].args.Owner,
    Admin,
    "event: select incorrect OwnerProduct"
  );
  })
});
