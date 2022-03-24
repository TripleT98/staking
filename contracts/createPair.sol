pragma solidity =0.5.16;

import "@uniswap/v2-core/contracts/UniswapV2Factory.sol";

contract CreatePair{

address token1;
address token2;
address factory;

constructor(address _token1, address _token2, address _factory) public {
  token1 = _token1;
  token2 = _token2;
  factory = _factory;
}

function getPairsLength() external view returns(uint){
  uint pairsLength = UniswapV2Factory(factory).allPairsLength();
  return pairsLength;
}

function getData() external view returns(address, address, address){
  return (token1, token2, factory);
}

function createPair() external returns (address){
   address pairAddress = UniswapV2Factory(factory).createPair(token1,token2);
   return pairAddress;
}

}
