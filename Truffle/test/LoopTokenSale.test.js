const assert = require("assert");
const truffleAssert = require("truffle-assertions");

contract("LoopTokenSale", (accounts) => {
  const LoopToken = artifacts.require("Products");
  const LoopTokenSale = artifacts.require("LoopTokenSale");
  const TokenPrice = 300000000000000; // wei
  const buyer = accounts[1];
  const admin = accounts[0];
  // 2m token exist and only 800K available for sell
  const tokensAvailableForSell = 800000;
  before(async () => {
    this.loopTokenSale = await LoopTokenSale.deployed();
    this.loopToken = await LoopToken.deployed();
  });
  it("success deployed", async () => {
    const address = this.loopTokenSale.address;
    assert.notStrictEqual(address, undefined, "address undefined");
    assert.notStrictEqual(address, "", "address is empty string");
    assert.notStrictEqual(
      address,
      0x0000000000000000000000000000000000000000,
      "address has 0x0"
    );
    assert.notStrictEqual(address, null, "address is null");
  });
  it("check the contract with the correct value", async () => {
    const TokenContract = await this.loopTokenSale.tokenContract();
    assert.notStrictEqual(TokenContract, undefined, "address undefined");
    assert.notStrictEqual(TokenContract, "", "address is empty string");
    assert.notStrictEqual(TokenContract, 0x0, "address has 0x0");
    assert.notStrictEqual(TokenContract, null, "address is null");
    const price = await this.loopTokenSale.tokenPrice();
    assert.strictEqual(price.toNumber(), TokenPrice, "token price");
  });

  it("buyToken", async () => {
    const numberOfToken = 10;
    const value = numberOfToken * TokenPrice;
    //check enough token exists for sell
    //1-send token from admin to contract
    SaleTokenAddress = await this.loopTokenSale.address;
    await this.loopToken.transfer(SaleTokenAddress, tokensAvailableForSell, {
      from: admin,
    });
    //2-check token transfer
    contractBalance = await this.loopToken.balanceOf(SaleTokenAddress);
    assert.strictEqual(contractBalance.toNumber(), tokensAvailableForSell);
    //3- buy more than token exists in contract for checking require

    await truffleAssert.reverts(
      this.loopTokenSale.buyToken(numberOfToken, {
        from: buyer,
        value: 99999999999999,
      })
    );

    const BuyToken = await this.loopTokenSale.buyToken(numberOfToken, {
      from: buyer,
      value: value,
    });
    BuyToken;
    const amount = await this.loopTokenSale.tokenSold();
    assert.strictEqual(
      amount.toNumber(),
      numberOfToken,
      "number of Token for solid"
    );

    const balanceOfBuyer = await this.loopToken.balanceOf(buyer);
    const balanceOfContractSale = await this.loopToken.balanceOf(
      SaleTokenAddress
    );
    assert.strictEqual(balanceOfBuyer.toNumber(), 10, "balanceOf buyer");
    assert.strictEqual(
      balanceOfContractSale.toNumber(),
      tokensAvailableForSell - 10,
      "balance of contract"
    );
    //try buy token different from the ether value

    await truffleAssert.reverts(
      this.loopTokenSale.buyToken(numberOfToken, {
        from: buyer,
        value: 1,
      })
    );

    //event
    //check event Sell
    const event = await BuyToken.logs;
    assert.strictEqual(
      event.length,
      1,
      "more or less than one event exist in Sell function "
    );
    //check name of selected event
    assert.strictEqual(event[0].event, "Sell", "event: select incorrect event");
    assert.strictEqual(
      event[0].args._buyer,
      accounts[1],
      "event: select incorrect accountBuyer "
    );
    assert.strictEqual(
      event[0].args._amount.toNumber(),
      numberOfToken,
      "event: count of Coin (value) for send select incorrect"
    );
  });
  it("endSale", async () => {
    await truffleAssert.reverts(this.loopTokenSale.endSale({ from: buyer }));
    const ContractSoldAddress = await this.loopToken.address;
    const TokenSold = await this.loopTokenSale.tokenSold();
    await this.loopTokenSale.endSale({ from: admin });
    const adminBalance = await this.loopToken.balanceOf(admin);
    const ContractBalance = await this.loopToken.balanceOf(ContractSoldAddress);
    const totalCoin = await this.loopToken.totalSupply();
    assert.strictEqual(
      adminBalance.toNumber(),
      totalCoin.toNumber() - TokenSold.toNumber()
    );
    assert.strictEqual(ContractBalance.toNumber(), 0);
  });
});
