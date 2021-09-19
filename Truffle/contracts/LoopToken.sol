// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

//Erc20
//1-name
//2-symbol
//3-decimals not added
//4-totalSupply
//5-balanceOf
//6-transfer + Event
//7-transferFrom +Event
//Approval + Event
//8-allowance

contract LoopToken {
    //name
    string public name = "Loop Token";
    //symbol
    string public symbol = "Loop";
    //standard remcommended
    string public standard = "Loop Token v1.0";
    //totalSupply
    uint256 public totalSupply;
    //decimals
    uint16 decimals = 0;

    //transfer Event
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    //approve Event
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    //transferFrom Event
    event TransferFrom(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    //balanceOf
    mapping(address => uint256) public balanceOf;

    mapping(address => mapping(address => uint256)) public allowance;

    constructor(uint256 _totalSupply) {
        totalSupply = _totalSupply;
        balanceOf[msg.sender] = totalSupply;
    }

    //transfer
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    //approve
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        //allowance
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    //transferFrom
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(balanceOf[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit TransferFrom(_from, _to, _value);
        return true;
    }
}
