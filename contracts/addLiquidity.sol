pragma solidity =0.6.6;

import "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol";

contract addLiquidity{

function addLiquidityETH(
  address token,
  uint amountTokenDesired,
  uint amountTokenMin,
  uint amountETHMin,
  address to,
  uint deadline
  )
  external payable
  returns (uint amountToken, uint amountETH, uint liquidity)
  {
   address payable v2routerAddress = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
   (uint amountToken, uint amountETH, uint liquidity) = UniswapV2Router02(v2routerAddress).
   addLiquidityETH(
      token,
      amountTokenDesired,
      amountTokenMin,
      amountETHMin,
      to,
      deadline
      );
   }

  

}
