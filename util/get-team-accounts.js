module.exports = (network, developmentAccounts) => {
  // 10%
  const alex = {
		mainnet: "0xe4e5BA07ab9079447a0F919b27Ca3A83b433a4aA",
		rinkeby: "0x867fa8870a5bb9C8F92dF9a67b387100abfbfF5e",
		development: developmentAccounts[1]
	};
  const jose = {
		mainnet: "0x2c0892045b2C28C188C0F87374210Faf833EA70b",
		rinkeby: "0x3bdBC3B07141977e642FBB3a226F434DE281e9C5",
		development: developmentAccounts[2]
	};
  const wendy = {
		mainnet: "0x01Df86ce03e8955Cb904C49B9f0f7DAf2Eb638e3",
		rinkeby: "0xAcC226c2d28F8eB70d0f229aDa8607B854Fb7aE8",
		development: developmentAccounts[4]
	};
  const jordan = {
		mainnet: "0x333132D03f9a7f72CbcA77be4bAF21543691cCce",
		rinkeby: "0x07270F15945361b971976050e7Dc2f80AFdcEDa2",
		development: developmentAccounts[5]
	};

  // 9%
  const soto = {
		mainnet: "0xCD6C335371ed6B39642402Be3Ee18697d9D8daa7",
		rinkeby: "0x52C1286557068A57274263A722e625C53DD7aCDE",
		development: developmentAccounts[8]
	};

	// 8%
	const yuca = {
		mainnet: "0x87376A16Ec8377Cc7894A73b513C4eae62fb14ae",
		rinkeby: "0x8fB176E58Ae0D5509EadB00e13d502a08498B276",
		development: developmentAccounts[3]
	};

	// %6
  const ariel = {
		mainnet: "0x07B3A641331330B2F8E56C16DA7Bdd7819083d61",
		rinkeby: "0x986f19ae52D4BDaEb4a18536C4C0a9DD31c7303e",
		development: developmentAccounts[9]
	};

  // %4
  const dany = {
		mainnet: "",
		rinkeby: "0x79810cf5256b3E659E87c71A82AE8EB8DCf4c128",
		development: developmentAccounts[6]
	};
  const richard = {
		mainnet: "0x980b62873F5cF8c8B5dD2CB4cE3aa755845F9674",
		rinkeby: "0xDd7a2655d49E8Cb34b7d5fA5033Ad0375c335EF7",
		development: developmentAccounts[7]
	};

  // 3%
  const maki = {
		mainnet: "0x7fB4f3cb08c1892B15784F7038d1444642886ec9",
		rinkeby: "0xA48e9B66BC680E81b0Fb3B86e12a30F368465c36",
		development: developmentAccounts[13]
	};
  const roxana = {
		mainnet: "0xD5360A4C449F8D44C3eB1483d6ae231B9e2f2b2E",
		rinkeby: "0xe33289F0470A7b04E741cfeAA7752fe1450e45AA",
		development: developmentAccounts[11]
	};
  const daniela = {
		mainnet: "0x4733B5beeF0971089E913afB1618062CA8Fec527",
		rinkeby: "0x0F8649E57265398C67373D477bd76a0a9A8438c2",
		development: developmentAccounts[12]
	};
  const cristian = {
		mainnet: "0x5e99536A448EEbB09147e5FA5abC183932193B3C",
		rinkeby: "0xaf583791e7963917921af430D7b4a9Db6EA781eE",
		development: developmentAccounts[14]
	};
  const alejandro = {
		mainnet: "0xF982fa37095baD4633150087195a8dFF32A1aBcf",
		rinkeby: "0xFdfF5881BCC1b554Dc5201C4D4498957c2Df934B",
		development: developmentAccounts[10]
	};

  return [
    // 10%
    alex[network],
    jose[network],
    wendy[network],
    jordan[network],
		
    // %9
    soto[network],

		// 8%
    yuca[network],

    // 6%
    ariel[network],

    // %4
    dany[network],
    richard[network],

    // 3%
    maki[network],
    roxana[network],
    daniela[network],
    cristian[network],
    alejandro[network],
  ];
};