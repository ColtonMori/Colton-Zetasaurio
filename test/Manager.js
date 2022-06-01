const timeMachine = require('ganache-time-traveler');
const Manager = artifacts.require("Manager");
const expect = require("../util/expect");
const getTeamAccounts = require("../util/get-team-accounts");

contract("Manager", async accounts => {
  let snapshotId;
  let managerContract;

  const tenEther = web3.utils.toWei('10');
  const onePointFourEther = BigInt(web3.utils.toWei('1.4'));
  const oneEther = BigInt(web3.utils.toWei('1'));
  const pointNineEther = BigInt(web3.utils.toWei('0.9'));
  const pointEightEther = BigInt(web3.utils.toWei('0.8'));
  const pointSixEther = BigInt(web3.utils.toWei('0.6'));
  const pointFiveEther = BigInt(web3.utils.toWei('0.5'));
  const pointFourEther = BigInt(web3.utils.toWei('0.4'));
  const pointThreeEther = BigInt(web3.utils.toWei('0.3'));

  const owner = accounts[0];
  const alex = accounts[1];
  const jose = accounts[2];
  const yuca = accounts[3];
  const wendy = accounts[4];
  const jordan = accounts[5];
  const dany = accounts[6];
  const richard = accounts[7];
  const soto = accounts[8];
  const ariel = accounts[9];
  const alejandro = accounts[10];
  const roxana = accounts[11];
  const daniela = accounts[12];
  const maki = accounts[13];
  const cristian = accounts[14];

  before('Deploy Contracts', async() => {
    managerContract = await Manager.new(getTeamAccounts('development', accounts));
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
  it("should have owner set correctly", async () => {
    assert.equal(await managerContract.owner(), accounts[0]);
  });

  it("should have alex account set correctly", async () => {
    assert.equal(await managerContract.alex(), accounts[1]);
  });

  it("should have jose account set correctly", async () => {
    assert.equal(await managerContract.jose(), accounts[2]);
  });

  it("should have yuca account set correctly", async () => {
    assert.equal(await managerContract.yuca(), accounts[3]);
  });

  it("should have wendy account set correctly", async () => {
    assert.equal(await managerContract.wendy(), accounts[4]);
  });

  it("should have jordan account set correctly", async () => {
    assert.equal(await managerContract.jordan(), accounts[5]);
  });

  it("should have dany account set correctly", async () => {
    assert.equal(await managerContract.dany(), accounts[6]);
  });

  it("should have richard account set correctly", async () => {
    assert.equal(await managerContract.richard(), accounts[7]);
  });

  it("should have soto account set correctly", async () => {
    assert.equal(await managerContract.soto(), accounts[8]);
  });

  it("should have ariel account set correctly", async () => {
    assert.equal(await managerContract.ariel(), accounts[9]);
  });

  it("should have alejandro account set correctly", async () => {
    assert.equal(await managerContract.alejandro(), accounts[10]);
  });

  it("should have roxana account set correctly", async () => {
    assert.equal(await managerContract.roxana(), accounts[11]);
  });

  it("should have daniela account set correctly", async () => {
    assert.equal(await managerContract.daniela(), accounts[12]);
  });

  it("should have maki account set correctly", async () => {
    assert.equal(await managerContract.maki(), accounts[13]);
  });

  it("should have cristian account set correctly", async () => {
    assert.equal(await managerContract.cristian(), accounts[14]);
  });

  it("should receive eth correctly", async () => {
    await managerContract.send(tenEther, { from: accounts[15] });

    const managerContractBalanceAfter = await web3.eth.getBalance(managerContract.address);
    assert.equal(managerContractBalanceAfter, tenEther);
  });

  //******************//
  // Test permissions //
  //******************//
  const notTheOwnerError = "Caller is not the owner";

  it("should only allow owner to distribute profit", async () => {
    await expect(managerContract.distributeProfit({ from: accounts[15] })).toThrow(notTheOwnerError);
  });

  //*******************//
  // Test distribution //
  //*******************//
  it("owner should receive 14%", async () => {
    await managerContract.send(tenEther, { from: accounts[15] });
    
    const ownerBalanceBefore = BigInt(await web3.eth.getBalance(owner));    
    const txn = await managerContract.distributeProfit();  
    const txnFee = BigInt(txn.receipt.gasUsed) * BigInt(web3.utils.toWei('50', 'gwei'));
    const ownerBalanceAfter = await web3.eth.getBalance(owner);

    assert.equal(String(ownerBalanceBefore + onePointFourEther - txnFee), ownerBalanceAfter);
  });

  it("alex should receive 10%", async () => {
    await managerContract.send(tenEther, { from: accounts[15] });
    
    const alexBalanceBefore = BigInt(await web3.eth.getBalance(alex));    
    await managerContract.distributeProfit();        
    const alexBalanceAfter = await web3.eth.getBalance(alex);

    assert.equal(String(alexBalanceBefore + oneEther), alexBalanceAfter);
  });

  it("jose should receive 10%", async () => {
    await managerContract.send(tenEther, { from: accounts[15] });
    
    const joseBalanceBefore = BigInt(await web3.eth.getBalance(jose));    
    await managerContract.distributeProfit();        
    const joseBalanceAfter = await web3.eth.getBalance(jose);

    assert.equal(String(joseBalanceBefore + oneEther), joseBalanceAfter);
  });

  it("wendy should receive 10%", async () => {
    await managerContract.send(tenEther, { from: accounts[15] });
    
    const wendyBalanceBefore = BigInt(await web3.eth.getBalance(wendy));    
    await managerContract.distributeProfit();        
    const wendyBalanceAfter = await web3.eth.getBalance(wendy);

    assert.equal(String(wendyBalanceBefore + oneEther), wendyBalanceAfter);
  });

  it("jordan should receive 10%", async () => {
    await managerContract.send(tenEther, { from: accounts[15] });
    
    const jordanBalanceBefore = BigInt(await web3.eth.getBalance(jordan));    
    await managerContract.distributeProfit();        
    const jordanBalanceAfter = await web3.eth.getBalance(jordan);

    assert.equal(String(jordanBalanceBefore + oneEther), jordanBalanceAfter);
  });

  it("soto should receive 9%", async () => {
    await managerContract.send(tenEther, { from: accounts[15] });
    
    const sotoBalanceBefore = BigInt(await web3.eth.getBalance(soto));    
    await managerContract.distributeProfit();        
    const sotoBalanceAfter = await web3.eth.getBalance(soto);

    assert.equal(String(sotoBalanceBefore + pointNineEther), sotoBalanceAfter);
  });

  it("yuca should receive 8%", async () => {
    await managerContract.send(tenEther, { from: accounts[15] });
    
    const yucaBalanceBefore = BigInt(await web3.eth.getBalance(yuca));    
    await managerContract.distributeProfit();        
    const yucaBalanceAfter = await web3.eth.getBalance(yuca);

    assert.equal(String(yucaBalanceBefore + pointEightEther), yucaBalanceAfter);
  });

  it("ariel should receive 6%", async () => {
    await managerContract.send(tenEther, { from: accounts[15] });
    
    const arielBalanceBefore = BigInt(await web3.eth.getBalance(ariel));    
    await managerContract.distributeProfit();        
    const arielBalanceAfter = await web3.eth.getBalance(ariel);

    assert.equal(String(arielBalanceBefore + pointSixEther), arielBalanceAfter);
  });

  it("dany should receive 4%", async () => {
    await managerContract.send(tenEther, { from: accounts[15] });
    
    const danyBalanceBefore = BigInt(await web3.eth.getBalance(dany));    
    await managerContract.distributeProfit();        
    const danyBalanceAfter = await web3.eth.getBalance(dany);

    assert.equal(String(danyBalanceBefore + pointFourEther), danyBalanceAfter);
  });

  it("richard should receive 4%", async () => {
    await managerContract.send(tenEther, { from: accounts[15] });
    
    const richardBalanceBefore = BigInt(await web3.eth.getBalance(richard));    
    await managerContract.distributeProfit();        
    const richardBalanceAfter = await web3.eth.getBalance(richard);

    assert.equal(String(richardBalanceBefore + pointFourEther), richardBalanceAfter);
  });

  it("maki should receive 3%", async () => {
    await managerContract.send(tenEther, { from: accounts[15] });
    
    const makiBalanceBefore = BigInt(await web3.eth.getBalance(maki));    
    await managerContract.distributeProfit();        
    const makiBalanceAfter = await web3.eth.getBalance(maki);

    assert.equal(String(makiBalanceBefore + pointThreeEther), makiBalanceAfter);
  });

  it("roxana should receive 3%", async () => {
    await managerContract.send(tenEther, { from: accounts[15] });
    
    const roxanaBalanceBefore = BigInt(await web3.eth.getBalance(roxana));    
    await managerContract.distributeProfit();        
    const roxanaBalanceAfter = await web3.eth.getBalance(roxana);

    assert.equal(String(roxanaBalanceBefore + pointThreeEther), roxanaBalanceAfter);
  });

  it("daniela should receive 3%", async () => {
    await managerContract.send(tenEther, { from: accounts[15] });
    
    const danielaBalanceBefore = BigInt(await web3.eth.getBalance(daniela));    
    await managerContract.distributeProfit();        
    const danielaBalanceAfter = await web3.eth.getBalance(daniela);

    assert.equal(String(danielaBalanceBefore + pointThreeEther), danielaBalanceAfter);
  });

  it("cristian should receive 3%", async () => {
    await managerContract.send(tenEther, { from: accounts[15] });
    
    const cristianBalanceBefore = BigInt(await web3.eth.getBalance(cristian));    
    await managerContract.distributeProfit();        
    const cristianBalanceAfter = await web3.eth.getBalance(cristian);

    assert.equal(String(cristianBalanceBefore + pointThreeEther), cristianBalanceAfter);
  });

  it("alejandro should receive 3%", async () => {
    await managerContract.send(tenEther, { from: accounts[15] });
    
    const alejandroBalanceBefore = BigInt(await web3.eth.getBalance(alejandro));    
    await managerContract.distributeProfit();        
    const alejandroBalanceAfter = await web3.eth.getBalance(alejandro);

    assert.equal(String(alejandroBalanceBefore + pointThreeEther), alejandroBalanceAfter);
  });
});