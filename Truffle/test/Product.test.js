const assert = require("assert");
const truffleAssertions = require("truffle-assertions");

contract("Product", (accounts) => {
  const LoopToken = artifacts.require("LoopToken");
  const Products = artifacts.require("Products");
  const Admin = accounts[0];
  const member = accounts[1];
  before(async () => {
    this.loopToken = await LoopToken.deployed();
    this.products = await Products.deployed();
  });
  it("success deployed", async () => {
    const address = await this.products.address;
    assert.notStrictEqual(address, undefined, "address undefined");
    assert.notStrictEqual(address, "", "address is empty string");
    assert.notStrictEqual(
      address,
      0x0000000000000000000000000000000000000000,
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
    assert.strictEqual(Id.toNumber(), Count.toNumber(), "check Id");
    assert.strictEqual(Owner, Admin, "check address");
    assert.strictEqual(ProductName, "book", "check productName");
    assert.strictEqual(descriptors, "good Book", "check descriptors");
    assert.strictEqual(ImgUrl, "https://bookImg.png", "check ImgUrl");
    assert.strictEqual(Price.toNumber(), 50, "check Price");

    //second product admin
    await this.products.AddProducts(
      "desk",
      "bad desk",
      "https://deskImg.png",
      10,
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
    assert.strictEqual(Id.toNumber(), Count.toNumber(), "check Id");
    assert.strictEqual(Owner, Admin, "check address");
    assert.strictEqual(ProductName, "desk", "check productName");
    assert.strictEqual(descriptors, "bad desk", "check descriptors");
    assert.strictEqual(ImgUrl, "https://deskImg.png", "check ImgUrl");
    assert.strictEqual(Price.toNumber(), 10, "check Price");

    //fist member product
    await this.products.AddProducts(
      "car",
      "fast car",
      "https://carImg.png",
      150000,
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
    assert.strictEqual(Id.toNumber(), Count.toNumber(), "check Id");
    assert.strictEqual(Owner, member, "check address");
    assert.strictEqual(ProductName, "car", "check productName");
    assert.strictEqual(descriptors, "fast car", "check descriptors");
    assert.strictEqual(ImgUrl, "https://carImg.png", "check ImgUrl");
    assert.strictEqual(Price.toNumber(), 150000, "check Price");
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
});
