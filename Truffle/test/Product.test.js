const assert = require("assert");
const truffleAssertions = require("truffle-assertions");

contract("Product", (accounts) => {
  const Products = artifacts.require("Products");
  const Admin = accounts[0];
  const member = accounts[1];
  before(async () => {
    this.products = await Products.deployed();
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
    await this.products.AddProducts(
      "book",
      "good Book",
      "https://bookImg.png",
      50,
      true,
      { from: Admin }
    );
    let Count = await this.products.Count();
    let Item = await this.products.items(Admin, Count.toNumber());
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
    await this.products.AddProducts(
      "desk",
      "bad desk",
      "https://deskImg.png",
      10,
      false,
      { from: Admin }
    );
    Count = await this.products.Count();
    Item = await this.products.items(Admin, Count.toNumber());
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
    await this.products.AddProducts(
      "car",
      "fast car",
      "https://carImg.png",
      150000,
      true,
      { from: member }
    );
    Count = await this.products.Count();
    Item = await this.products.items(member, Count.toNumber());
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
      this.products.AddProducts(
        "car",
        "fast car",
        "https://carImg.png",
        250000,
        { from: member }
      )
    );
  });
  it('buyProduct',async()=>{
    await truffleAssertions.reverts(this.products.BuyProduct(member,10,{from:Admin}))
    await truffleAssertions.reverts(this.products.BuyProduct(Admin,2,{from:member}))
    await this.products.BuyProduct(member,3,{from:Admin});
    let Item = await this.products.items(member, 3);
    let Id = await Item.Id;
    let balance = await this.products.balanceOf(Admin);
    assert.strictEqual(balance.toNumber(),1850000,"balance of Admin");
    assert.strictEqual(Id.toNumber(),0,"products id should 0")
    Item = await this.products.items(Admin, 3);
    Id = await Item.Id;
    balance = await this.products.balanceOf(member);
    assert.strictEqual(balance.toNumber(),150000,"balance of member");
    assert.strictEqual(Id.toNumber(),3,"products id should 3")
    assert.strictEqual(Item.SellAble,false,"products shouldn't sellAble")

  })
  it("ChangeProduct", async ()=>{
    await truffleAssertions.reverts(this.products.ChangeProduct(5,"BigCar","fast very fast","https/:/Image.fastCar.png",180000,true,{from:Admin}))
    await truffleAssertions.reverts(this.products.ChangeProduct(3,"BigCar","fast very fast","https/:/Image.fastCar.png",180000,true,{from:member}))
    await this.products.ChangeProduct(3,"BigCar","fast very fast","https/:/Image.fastCar.png",180000,true,{from:Admin});
    let Item = await this.products.items(Admin,3);
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
  })
  it('DeleteProduct',async()=>{
    await truffleAssertions.reverts(this.products.DeleteProduct(5,{from:Admin}))
    await truffleAssertions.reverts(this.products.DeleteProduct(3,{from:member}))
    await this.products.DeleteProduct(3,{from:Admin})
    let Item = await this.products.items(Admin,3);
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
  })
});
