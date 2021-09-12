const assert = require("assert");
const LoopToken = artifacts.require("Products");
const truffleAssert = require("truffle-assertions");

contract("LoopToken", async (accounts) => {
  before(async () => {
    this.loopToken = await LoopToken.deployed();
  });
  it("success deployed", async () => {
    const address = this.loopToken.address;
    assert.notStrictEqual(address, undefined, "address undefined");
    assert.notStrictEqual(address, "", "address is empty string");
    assert.notStrictEqual(address, 0x0, "address has 0x0");
    assert.notStrictEqual(address, null, "address is null");
  });

  it("check contract value", async () => {
    const nameToken = await this.loopToken.name();
    const symbolToken = await this.loopToken.symbol();
    const standardToken = await this.loopToken.standard();
    assert.strictEqual(
      symbolToken,
      "Loop",
      "correct symbol",
      "incorrect symbol"
    );
    assert.strictEqual(nameToken, "Loop Token", "incorrect name");
    assert.strictEqual(standardToken, "Loop Token v1.0", "incorrect standard");
  });

  it("totalSupply", async () => {
    const total = await this.loopToken.totalSupply();
    assert.strictEqual(
      total.toNumber(),
      2000000,
      "total coin has  incorrect value"
    );
  });

  it("accountBalance", async () => {
    let balanceAccount;
    await this.loopToken.balanceOf(accounts[0]).then((Balance) => {
      balanceAccount = Balance.toNumber();
    });
    assert.strictEqual(
      balanceAccount,
      2000000,
      "coinBaseAccount doesn't have totalSupply"
    );
  });

  it("transfers", async () => {
    //transaction 01 checking for revert (effect of require in transfer function)

    await truffleAssert.reverts(
      this.loopToken.transfer.call(accounts[0], 9999999999999)
    );

    //transaction 02 => account[0] 2000000 - 500000|| account[1] 0 + 500000
    const result = await this.loopToken.transfer(accounts[1], 500000, {
      from: accounts[0],
    });
    result;
    balanceAccount1 = await this.loopToken.balanceOf(accounts[0]);
    balanceAccount2 = await this.loopToken.balanceOf(accounts[1]);
    assert.strictEqual(
      balanceAccount1.toNumber(),
      1500000,
      "transaction02 failed"
    );
    assert.strictEqual(
      balanceAccount2.toNumber(),
      500000,
      "transaction02 failed"
    );
    //event transaction
    const event = result.logs;
    //check function transfer only have one event
    assert.strictEqual(
      event.length,
      1,
      "more or less than one event exist in transfer function "
    );
    //check name of selected event
    assert.strictEqual(
      event[0].event,
      "Transfer",
      "event: select incorrect event"
    );
    assert.strictEqual(
      event[0].args._from,
      accounts[0],
      "event: select incorrect account for send value"
    );
    assert.strictEqual(
      event[0].args._to,
      accounts[1],
      "event: select incorrect account for receive value"
    );
    assert.strictEqual(
      event[0].args._value.toNumber(),
      500000,
      "event: count of Coin (value) for send select incorrect"
    );
    //check value(transaction 03) return true
    const checkResult = await this.loopToken.transfer.call(
      accounts[1],
      500000,
      { from: accounts[0] }
    );
    assert.strictEqual(
      checkResult,
      true,
      "transaction03 failed( return to false)"
    );
  });

  it("approve tokens for delegated transfer", async () => {
    const approveResult = await this.loopToken.approve.call(accounts[1], 100);
    assert.strictEqual(approveResult, true, "it's not return true");

    //event
    const approveFunction = await this.loopToken.approve(accounts[1], 100, {
      from: accounts[0],
    });
    const event = await approveFunction.logs;
    assert.strictEqual(
      event.length,
      1,
      "more or less than one event exist in approve function "
    );
    //check name of selected event
    assert.strictEqual(
      event[0].event,
      "Approval",
      "event: select incorrect event"
    );
    assert.strictEqual(
      event[0].args._owner,
      accounts[0],
      "event: select incorrect account for send value"
    );
    assert.strictEqual(
      event[0].args._spender,
      accounts[1],
      "event: select incorrect account for receive value"
    );
    assert.strictEqual(
      event[0].args._value.toNumber(),
      100,
      "event: count of Coin (value) for send select incorrect"
    );
    CheckAllowance = await this.loopToken.allowance(accounts[0], accounts[1]);
    assert.strictEqual(
      CheckAllowance.toNumber(),
      100,
      "stores the allowance for delegated transfer"
    );
  });

  it("TransferFrom", async () => {
    const fromAccount = await accounts[2];
    const toAccount = await accounts[3];
    const spendingAccount = await accounts[4];
    await this.loopToken.transfer(fromAccount, 100, { from: accounts[0] });
    await this.loopToken.approve(spendingAccount, 10, { from: fromAccount });
    //test require for try transfer more than token in exist in account

    await truffleAssert.reverts(
      this.loopToken.transferFrom(fromAccount, toAccount, 9999, {
        from: spendingAccount,
      })
    );

    //test require for try transfer more than token allowance to transfer

    await truffleAssert.reverts(
       this.loopToken.transferFrom(fromAccount, toAccount, 50, {
        from: spendingAccount,
      })
    );

    const transferFromFunction = await this.loopToken.transferFrom(
      fromAccount,
      toAccount,
      5,
      { from: spendingAccount }
    );
    const fromAccountBalance = await this.loopToken.balanceOf(accounts[2]);
    const toAccountBalance = await this.loopToken.balanceOf(accounts[3]);
    assert.strictEqual(fromAccountBalance.toNumber(), 95);
    assert.strictEqual(toAccountBalance.toNumber(), 5);
    const UpdatedAllowance = await this.loopToken.allowance(
      fromAccount,
      spendingAccount
    );
    assert.strictEqual(UpdatedAllowance.toNumber(), 5);
    //check return true transferFrom
    const checkResult = await this.loopToken.transferFrom.call(
      fromAccount,
      toAccount,
      5,
      { from: spendingAccount }
    );
    assert.strictEqual(checkResult, true, "check return true transferForm");

    //check event TransFrom
    const event = await transferFromFunction.logs;
    assert.strictEqual(
      event.length,
      1,
      "more or less than one event exist in transferFrom function "
    );
    //check name of selected event
    assert.strictEqual(
      event[0].event,
      "TransferFrom",
      "event: select incorrect event"
    );
    assert.strictEqual(
      event[0].args._from,
      accounts[2],
      "event: select incorrect account for send value"
    );
    assert.strictEqual(
      event[0].args._to,
      accounts[3],
      "event: select incorrect account for receive value"
    );
    assert.strictEqual(
      event[0].args._value.toNumber(),
      5,
      "event: count of Coin (value) for send select incorrect"
    );
  });
});
