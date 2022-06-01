const timeMachine = require('ganache-time-traveler');
const Manager = artifacts.require("Manager");
const ZetaSaurio = artifacts.require("Zetasaurio");
const expect = require("../util/expect");
const getTeamAccounts = require("../util/get-team-accounts");

// 13 November 2021 12:00:00 AM <=> 1636761600
const november13Of2021 = 1636761600;
// 14 November 2021 12:00:00 AM <=> 1636848000
const november14Of2021 = 1636848000;
// 15 November 2021 12:00:00 AM <=> 1636934400
const november15Of2021 = 1636934400;

const eighteenHours = 64800;
const thirtySixHours = 129600;
const oneHundredEightHours = 388800;

contract("Zetasaurio", async accounts => {
  let snapshotId;
  let zetaContract;
  let managerContract;

  const tenEther = web3.utils.toWei('10');

  before('Deploy Contracts', async() => {
    managerContract = await Manager.new(getTeamAccounts('development', accounts));
    zetaContract = await ZetaSaurio.new(managerContract.address);
  });

  beforeEach(async() => {
    const snapshot = await timeMachine.takeSnapshot();
    snapshotId = snapshot['result'];
  });

  afterEach(async() => {
    await timeMachine.revertToSnapshot(snapshotId);
  });
  
  //***************//
  // Test defaults //
  //***************//
  it("should be named ZetaSaurio", async () => {
    const name = await zetaContract.name();

    assert.equal(name, "ZetaSaurio");
  });

  it("should have ZS by symbol", async () => {
    const symbol = await zetaContract.symbol();

    assert.equal(symbol, "ZS");
  });

  it("should have owner set correctly", async () => {
    assert.equal(await zetaContract.owner(), accounts[0]);
  });

  it("should have manager set correctly", async () => {
    assert.equal(await zetaContract.manager(), managerContract.address);
  });

  it("should have presale start equals to 0", async () => {
    const presaleStart = await zetaContract.presaleStart();

    assert.equal(presaleStart, 0);
  });

  it("should have sale start equals to 0", async () => {
    const saleStart = await zetaContract.saleStart();

    assert.equal(saleStart, 0);
  });

  it("should have max supply limited to 10000", async () => {
    const maxSupply = await zetaContract.maxSupply();

    assert.equal(maxSupply, 10000);
  });

  it("should have cost equals to 0.08 ether", async () => {
    const cost = String(await zetaContract.cost());

    assert.equal(cost, web3.utils.toWei('0.08'));
  });

  it("should have batch mint limited to 5", async () => {
    const batchMintLimit = await zetaContract.batchMintLimit();

    assert.equal(batchMintLimit, 5);
  });

  it("should have presale mint per address limited to 2 ", async () => {
    const presaleMintPerAddressLimit = await zetaContract.presaleMintPerAddressLimit();

    assert.equal(presaleMintPerAddressLimit, 2);
  });

  it("should have empty base URI by default", async () => {
    const baseURI = await zetaContract.baseURI();

    assert.equal(baseURI, "");
  });

  it("should have presale inactive by default", async () => {
    const presaleIsActive = await zetaContract.presaleIsActive();

    assert.equal(presaleIsActive, false);
  });

  it("should have sale inactive by default", async () => {
    const saleIsActive = await zetaContract.saleIsActive();

    assert.equal(saleIsActive, false);
  });

  //**************//
  // Test setters //
  //**************//
  it("should change baseURI correctly", async () => {
    const newBaseURI = "A brand new base uri";
    await zetaContract.setBaseURI(newBaseURI);
    const baseURI = await zetaContract.baseURI();

    assert.equal(baseURI, newBaseURI);
  });

  it("should schedule presale correctly", async () => {
    await zetaContract.schedulePresale(november13Of2021);

    const presaleStart = await zetaContract.presaleStart();

    assert.equal(presaleStart, november13Of2021);
  });

  it("should schedule sale correctly", async () => {
    await zetaContract.scheduleSale(november15Of2021);

    const saleStart = await zetaContract.saleStart();

    assert.equal(saleStart, november15Of2021);
  });

  it("should activate sale just after sale start", async () => {
    await zetaContract.scheduleSale(november15Of2021);
    await timeMachine.advanceBlockAndSetTime(november15Of2021);
    const saleIsActive = await zetaContract.saleIsActive();

    assert.equal(saleIsActive, true);
  });

  it("shouldn't activate sale before the sale start", async () => {
    await zetaContract.scheduleSale(november15Of2021);
    await timeMachine.advanceBlockAndSetTime(november15Of2021 - 1);
    const saleIsActive = await zetaContract.saleIsActive();

    assert.equal(saleIsActive, false);
  });

  it("should reserve correctly", async () => {
    const supplyBefore = await zetaContract.totalSupply();
    await zetaContract.reserve(5);
    const supplyAfter = await zetaContract.totalSupply();

    assert.equal(supplyBefore.toNumber() + 5, supplyAfter.toNumber());
  });

  it("should withdraw correctly", async () => {
    await zetaContract.scheduleSale(1);
    await zetaContract.mint(1, {
      from: accounts[2],
      value: tenEther,
    });

    await zetaContract.withdraw();

    const zetaContractBalanceAfter = await web3.eth.getBalance(zetaContract.address);
    const managerContractBalanceAfter = await web3.eth.getBalance(managerContract.address);
                                                                                                                         
    assert.equal(zetaContractBalanceAfter, '0');
    assert.equal(managerContractBalanceAfter, tenEther);
  });

  //******************//
  // Test permissions //
  //******************//
  const notTheOwnerError = "Caller is not the owner";

  it("should only allow owner to change baseURI", async () => {
    const newBaseURI = "A brand new base uri";

    await expect(zetaContract.setBaseURI(newBaseURI, { from: accounts[1] }))
      .toThrow(notTheOwnerError);
  });

  it("should only allow owner to schedule presale", async () => {
    await expect(zetaContract.schedulePresale(november13Of2021, { from: accounts[1] }))
      .toThrow(notTheOwnerError);
  });

  it("should only allow owner to schedule sale", async () => {
    await expect(zetaContract.scheduleSale(november15Of2021, { from: accounts[1] }))
      .toThrow(notTheOwnerError);
  });

  it("should only allow owner to grant presale access", async () => {
    await expect(zetaContract.grantPresaleAccess([], { from: accounts[1] }))
      .toThrow(notTheOwnerError);
  });

  it("should only allow owner to revoke presale access", async () => {
    await expect(zetaContract.revokePresaleAccess([], { from: accounts[1] }))
      .toThrow(notTheOwnerError);
  });

  it("should only allow owner to withdraw", async () => {
    await expect(zetaContract.withdraw({ from: accounts[1] }))
      .toThrow(notTheOwnerError);
  });

  it("should only allow owner to reserve", async () => {
    await expect(zetaContract.reserve(30, { from: accounts[1] }))
      .toThrow(notTheOwnerError);
  });

  //********************************//
  // Test presale access management //
  //********************************//
  it("shouldn't grant presale access by default", async () => {
    const account0hasPresaleAccess = await zetaContract.hasPresaleAccess(accounts[0]);
    const account1hasPresaleAccess = await zetaContract.hasPresaleAccess(accounts[1]);
    const account2hasPresaleAccess = await zetaContract.hasPresaleAccess(accounts[2]);
    
    assert.equal(account0hasPresaleAccess, false);
    assert.equal(account1hasPresaleAccess, false);
    assert.equal(account2hasPresaleAccess, false);
  });

  it("should grant presale access correctly", async () => {
    await zetaContract.grantPresaleAccess([accounts[0], accounts[1], accounts[2]]);

    const account0hasPresaleAccess = await zetaContract.hasPresaleAccess(accounts[0]);
    const account1hasPresaleAccess = await zetaContract.hasPresaleAccess(accounts[1]);
    const account2hasPresaleAccess = await zetaContract.hasPresaleAccess(accounts[2]);

    assert.equal(account0hasPresaleAccess, true);
    assert.equal(account1hasPresaleAccess, true);
    assert.equal(account2hasPresaleAccess, true);
  });

  it("should revoke presale access correctly", async () => {
    await zetaContract.grantPresaleAccess([accounts[0], accounts[1], accounts[2]]);
    await zetaContract.revokePresaleAccess([accounts[0], accounts[1], accounts[2]]);

    const account0hasPresaleAccess = await zetaContract.hasPresaleAccess(accounts[0]);
    const account1hasPresaleAccess = await zetaContract.hasPresaleAccess(accounts[1]);
    const account2hasPresaleAccess = await zetaContract.hasPresaleAccess(accounts[2]);
    
    assert.equal(account0hasPresaleAccess, false);
    assert.equal(account1hasPresaleAccess, false);
    assert.equal(account2hasPresaleAccess, false);
  });

  //********************************//
  // Test presale stages activation //
  //********************************//
  it("should activate alpha presale at the beginning of the interval", async () => {
    await zetaContract.schedulePresale(november13Of2021);
    await timeMachine.advanceBlockAndSetTime(november13Of2021);
    const presaleAlphaIsActive = await zetaContract.presaleAlphaIsActive();

    assert.equal(presaleAlphaIsActive, true);
  });

  it("should activate alpha presale at the end of the interval", async () => {
    await zetaContract.schedulePresale(november13Of2021);
    await timeMachine.advanceBlockAndSetTime(november13Of2021 + thirtySixHours - 1);
    const presaleAlphaIsActive = await zetaContract.presaleAlphaIsActive();

    assert.equal(presaleAlphaIsActive, true);
  });

  it("shouldn't activate alpha presale before the beginning of the interval", async () => {
    await zetaContract.schedulePresale(november13Of2021);
    await timeMachine.advanceBlockAndSetTime(november13Of2021 - 1);
    const presaleAlphaIsActive = await zetaContract.presaleAlphaIsActive();

    assert.equal(presaleAlphaIsActive, false);
  });

  it("shouldn't activate alpha presale after the end of the interval", async () => {
    await zetaContract.schedulePresale(november13Of2021);
    await timeMachine.advanceBlockAndSetTime(november13Of2021 + thirtySixHours);
    const presaleAlphaIsActive = await zetaContract.presaleAlphaIsActive();

    assert.equal(presaleAlphaIsActive, false);
  });

  it("should activate beta presale at the beginning of the interval", async () => {
    await zetaContract.schedulePresale(november13Of2021);
    await timeMachine.advanceBlockAndSetTime(november13Of2021 + oneHundredEightHours);    
    const presaleBetaIsActive = await zetaContract.presaleBetaIsActive();

    assert.equal(presaleBetaIsActive, true);
  });

  it("should activate beta presale at the end of the interval", async () => {
    await zetaContract.schedulePresale(november13Of2021);
    await timeMachine.advanceBlockAndSetTime(november13Of2021 + oneHundredEightHours + thirtySixHours - 1);
    const presaleBetaIsActive = await zetaContract.presaleBetaIsActive();

    assert.equal(presaleBetaIsActive, true);
  });

  it("shouldn't activate beta presale before the beginning of the interval", async () => {
    await zetaContract.schedulePresale(november13Of2021);
    await timeMachine.advanceBlockAndSetTime(november13Of2021 + oneHundredEightHours - 1);
    const presaleBetaIsActive = await zetaContract.presaleBetaIsActive();

    assert.equal(presaleBetaIsActive, false);
  });

  it("shouldn't activate beta presale after the end of the interval", async () => {
    await zetaContract.schedulePresale(november13Of2021);    
    await timeMachine.advanceBlockAndSetTime(november13Of2021 + oneHundredEightHours + thirtySixHours);
    const presaleBetaIsActive = await zetaContract.presaleBetaIsActive();

    assert.equal(presaleBetaIsActive, false);
  });

  it("should activate gamma presale at the beginning of the interval", async () => {
    await zetaContract.schedulePresale(november13Of2021);
    await timeMachine.advanceBlockAndSetTime(november13Of2021 + oneHundredEightHours + oneHundredEightHours);    
    const presaleGammaIsActive = await zetaContract.presaleGammaIsActive();

    assert.equal(presaleGammaIsActive, true);
  });

  it("should activate gamma presale at the end of the interval", async () => {
    await zetaContract.schedulePresale(november13Of2021);
    await timeMachine.advanceBlockAndSetTime(november13Of2021 + oneHundredEightHours + oneHundredEightHours + thirtySixHours - 1);
    const presaleGammaIsActive = await zetaContract.presaleGammaIsActive();

    assert.equal(presaleGammaIsActive, true);
  });

  it("shouldn't activate gamma presale before the beginning of the interval", async () => {
    await zetaContract.schedulePresale(november13Of2021);
    await timeMachine.advanceBlockAndSetTime(november13Of2021 + oneHundredEightHours + oneHundredEightHours - 1);    
    const presaleGammaIsActive = await zetaContract.presaleGammaIsActive();

    assert.equal(presaleGammaIsActive, false);
  });

  it("shouldn't activate gamma presale after the end of the interval", async () => {
    await zetaContract.schedulePresale(november13Of2021);
    await timeMachine.advanceBlockAndSetTime(november13Of2021 + oneHundredEightHours + oneHundredEightHours + thirtySixHours);
    const presaleGammaIsActive = await zetaContract.presaleGammaIsActive();

    assert.equal(presaleGammaIsActive, false);
  });

  //***********//
  // Test cost //
  //***********//
  it("should cost 0.04 eth on alpha presale", async () => {
    await zetaContract.schedulePresale(november13Of2021);
    await timeMachine.advanceBlockAndSetTime(november13Of2021 + eighteenHours);
    const cost = await zetaContract.cost();

    assert.equal(cost, web3.utils.toWei('0.04'));
  });

  it("should cost 0.05 eth on beta presale", async () => {
    await zetaContract.schedulePresale(november13Of2021);
    await timeMachine.advanceBlockAndSetTime(november13Of2021 + oneHundredEightHours + eighteenHours);
    const cost = await zetaContract.cost();

    assert.equal(cost, web3.utils.toWei('0.05'));
  });

  it("should cost 0.06 eth on gamma presale", async () => {
    await zetaContract.schedulePresale(november13Of2021);
    await timeMachine.advanceBlockAndSetTime(november13Of2021 + oneHundredEightHours + oneHundredEightHours + eighteenHours);
    const cost = await zetaContract.cost();

    assert.equal(cost, web3.utils.toWei('0.06'));
  });

  //***********//
  // Test mint //
  //***********//
  it("should not mint when sale is inactive", async () => {
    await expect(zetaContract.mint(1)).toThrow("Sale is not active");
  });

  it("should not mint less than 1 NFT", async () => {
    await timeMachine.advanceBlockAndSetTime(november15Of2021);
    await zetaContract.scheduleSale(november13Of2021);

    await expect(zetaContract.mint(0)).toThrow("Must mint at least one NFT");
  });

  it("should not mint beyond maxSupply", async () => {
    await zetaContract.scheduleSale(november13Of2021);
    const maxSupply = (await zetaContract.maxSupply()).toNumber();
    await timeMachine.advanceBlockAndSetTime(november15Of2021);

    await expect(zetaContract.mint(maxSupply + 1)).toThrow("Supply left is not enough");
  });

  it("should require to pay enough for minting", async () => {
    const cost = await zetaContract.cost();
    const costOf3 = BigInt(String(cost)) * 3n;
    await zetaContract.scheduleSale(november13Of2021);
    await timeMachine.advanceBlockAndSetTime(november15Of2021);

    await expect(zetaContract.mint(3, {
      from: accounts[1],
      value: String(costOf3 - 1n)
    })).toThrow("Not enough funds to purchase");
  });

  it("should update mintedPerAddress correctly when minting", async () => {
    await zetaContract.scheduleSale(november13Of2021);
    await zetaContract.mint(3, { value: web3.utils.toWei('0.24')});
    const mintedPerAddress = await zetaContract.mintedPerAddress(accounts[0]);
    await timeMachine.advanceBlockAndSetTime(november15Of2021);

    assert.equal(mintedPerAddress.toNumber(), 3);
  });

  it("shouldn't allow to mint on presale if access haven't been granted", async () => {
    await zetaContract.schedulePresale(november13Of2021);
    await timeMachine.advanceBlockAndSetTime(november14Of2021);
    const cost = String(await zetaContract.cost());

    await expect(zetaContract.mint(1, {
      value: cost,
      from: accounts[1],
    })).toThrow("Presale access denied");
  });

  it("should allow to mint on presale if access have been granted", async () => {    
    await zetaContract.schedulePresale(november13Of2021);
    await zetaContract.grantPresaleAccess([accounts[1]]);
    await timeMachine.advanceBlockAndSetTime(november14Of2021);
    const cost = String(await zetaContract.cost());
    await zetaContract.mint(1, {
      value: cost,
      from: accounts[1],
    });
    const ownerOfToken = await zetaContract.ownerOf(1);

    assert.equal(ownerOfToken, accounts[1]);
  });

  it("shouldn't allow to mint on presale beyond presaleMintPerAddressLimit", async () => {
    await zetaContract.schedulePresale(november13Of2021);
    await zetaContract.grantPresaleAccess([accounts[1]]);
    const presaleMintPerAddressLimit = BigInt(await zetaContract.presaleMintPerAddressLimit());
    await timeMachine.advanceBlockAndSetTime(november14Of2021);
    const cost = BigInt(await zetaContract.cost());
    const batchCost = String(presaleMintPerAddressLimit * cost);

    await zetaContract.mint(1, { from: accounts[1], value: String(cost) });

    await expect(
      zetaContract.mint(Number(presaleMintPerAddressLimit), {
        from: accounts[1],
        value: batchCost,
      })
    ).toThrow("Not enough presale mintings left");
  });
});