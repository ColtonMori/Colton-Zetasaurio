// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

/*
      .".".".
    (`       `)               _.-=-.
     '._.--.-;             .-`  -'  '.
    .-'`.o )  \           /  .-_.--'  `\
   `;---) \    ;         /  / ;' _-_.-' `
     `;"`  ;    \        ; .  .'   _-' \
      (    )    |        |  / .-.-'    -`
       '-.-'     \       | .' ` '.-'-\`
        /_./\_.|\_\      ;  ' .'-'.-.
        /         '-._    \` /  _;-,
       |         .-=-.;-._ \  -'-,
       \        /      `";`-`,-"`)
        \       \     '-- `\.\
         '.      '._ '-- '--'/
           `-._     `'----'`;
               `"""--.____,/
                      \\  \
                      // /`
                  ___// /__
                (`(`(---"-`)
*/
contract ZetaSaurio is ERC721Enumerable {
    using Strings for uint256;

    address public owner;
    address public manager;

    string public baseURI = "";

    uint256 public saleStart;
    uint256 public presaleStart;
    uint256 public constant maxSupply = 10000;
    uint256 public constant batchMintLimit = 5;
    uint256 public constant presaleMintPerAddressLimit = 2;

    mapping(address => bool) public hasPresaleAccess;
    mapping(address => uint256) public mintedPerAddress;

    constructor(address _manager) ERC721("ZetaSaurio", "ZS") {
        owner = msg.sender;
        manager = _manager;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Caller is not the owner");
        _;
    }

    /**
     * @dev Base URI for computing {tokenURI} in {ERC721} parent contract.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function schedulePresale(uint256 _start) public onlyOwner {
        presaleStart = _start;
    }

    function scheduleSale(uint256 _start) public onlyOwner {
        saleStart = _start;
    }

    function presaleAlphaIsActive() public view returns (bool) {
        return presaleStart <= block.timestamp && block.timestamp < (presaleStart + 129600);
    }

    function presaleBetaIsActive() public view returns (bool) {
        return (presaleStart + 388800) <= block.timestamp && block.timestamp < (presaleStart + 518400);
    }

    function presaleGammaIsActive() public view returns (bool) {
        return (presaleStart + 777600) <= block.timestamp && block.timestamp < (presaleStart + 907200);
    }

    function presaleIsActive() public view returns (bool) {
        return presaleAlphaIsActive() || presaleBetaIsActive() || presaleGammaIsActive();
    }

    function saleIsActive() public view returns (bool) {
        return saleStart != 0 && saleStart <= block.timestamp;
    }

    function cost() public view virtual returns (uint256) {
        if (presaleAlphaIsActive()) return 0.04 ether;
        if (presaleBetaIsActive()) return 0.05 ether;
        if (presaleGammaIsActive()) return 0.06 ether;

        return 0.08 ether;
    }

    function grantPresaleAccess(address[] calldata _users) public onlyOwner {
        for (uint256 i = 0; i < _users.length; i++) {
            hasPresaleAccess[_users[i]] = true;
        }
    }

    function revokePresaleAccess(address[] calldata _users) public onlyOwner {
        for (uint256 i = 0; i < _users.length; i++) {
            hasPresaleAccess[_users[i]] = false;
        }
    }

    function withdraw() public payable onlyOwner {
        require(payable(manager).send(address(this).balance));
    }

    /**
     * Reserve zetas for team and giveaways.
     */
    function reserve(uint256 _amount) public onlyOwner {
        uint256 supply = totalSupply();

        for (uint256 i = 1; i <= _amount; i++) {
            _safeMint(msg.sender, supply + i);
        }
    }

    function mint(uint256 _mintAmount) public payable {
        uint256 supply = totalSupply();

        require(saleIsActive() || presaleIsActive(), "Sale is not active");
        require(_mintAmount > 0, "Must mint at least one NFT");
        require(supply + _mintAmount <= maxSupply, "Supply left is not enough");
        require(_mintAmount <= batchMintLimit, "Can't mint these many NFTs at once");
        require(msg.value >= cost() * _mintAmount, "Not enough funds to purchase");

        if (presaleIsActive()) {
            require(hasPresaleAccess[msg.sender], "Presale access denied");
            require(
                mintedPerAddress[msg.sender] + _mintAmount < presaleMintPerAddressLimit,
                "Not enough presale mintings left"
            );
        }

        for (uint256 i = 1; i <= _mintAmount; i++) {
            mintedPerAddress[msg.sender]++;
            _safeMint(msg.sender, supply + i);
        }
    }
}
