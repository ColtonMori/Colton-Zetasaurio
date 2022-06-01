// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Manager {
  // 14%
  address public owner;

  // 10%
  address public alex;
  address public jose;
  address public wendy;
  address public jordan;

  // 9%
  address public soto;

  // 8%
  address public yuca;

  // 6%
  address public ariel;

  // 4%
  address public dany;
  address public richard;

  // 3%
  address public maki;
  address public roxana;
  address public daniela;
  address public cristian;
  address public alejandro;

  constructor(address[14] memory _teamAccounts) {
    // 14%
    owner = msg.sender;

    // 10%
    alex = _teamAccounts[0];
    jose = _teamAccounts[1];
    wendy = _teamAccounts[2];
    jordan = _teamAccounts[3];

    // 9%
    soto = _teamAccounts[4];

    // 8%
    yuca = _teamAccounts[5];

    // 6%
    ariel = _teamAccounts[6];

    // 4%
    dany = _teamAccounts[7];
    richard = _teamAccounts[8];

    // 3%
    maki = _teamAccounts[9];
    roxana = _teamAccounts[10];
    daniela = _teamAccounts[11];
    cristian = _teamAccounts[12];
    alejandro = _teamAccounts[13];
  }

  // Will receive any eth sent to the contract
  receive() external payable {}
  
  function distributeProfit() public payable {
    require(msg.sender == owner, "Caller is not the owner");

    uint256 balance = address(this).balance;

    // 14%
    require(payable(owner).send(balance * 14 / 100));

    // 10%
    require(payable(alex).send(balance / 10));
    require(payable(jose).send(balance / 10));
    require(payable(wendy).send(balance / 10));
    require(payable(jordan).send(balance / 10));

    // 9%
    require(payable(soto).send(balance * 9 / 100));

    // 8%
    require(payable(yuca).send(balance * 2 / 25));

    // 4%
    require(payable(dany).send(balance / 25));
    require(payable(richard).send(balance / 25));

    // 6%
    require(payable(ariel).send(balance * 3 / 50));

    // 3%
    require(payable(maki).send(balance * 3 / 100));
    require(payable(roxana).send(balance * 3 / 100));
    require(payable(daniela).send(balance * 3 / 100));
    require(payable(cristian).send(balance * 3 / 100));
    require(payable(alejandro).send(balance * 3 / 100));
  }
}
