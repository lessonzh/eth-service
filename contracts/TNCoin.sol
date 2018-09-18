pragma solidity ^0.4.20;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract TNCoin is StandardToken {
    string public name = 'TNCoinToken';
    string public symbol = 'TNC';
    uint public decimals = 2;
    uint public INITIAL_SUPPLY = 10000000;

    constructor() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
    }
}
