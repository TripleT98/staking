let {abi} = require("./../artifacts/contracts/createPair.sol/CreatePair.json");
let liq = require("./../artifacts/contracts/addLiquidity.sol/addLiquidity.json");
let uniswap = require("./../artifacts/contracts/Routers/UniswapV2Router02.sol/UniswapV2Router02.json");
let factory = require("./../artifacts/contracts/Core/UniswapV2Factory.sol/UniswapV2Factory.json");
import Web3 from "web3";
import * as dotenv from "dotenv";
import { task } from "hardhat/config";

dotenv.config();

interface SignedTransaction {
    messageHash?: string;
    r: string;
    s: string;
    v: string;
    rawTransaction?: string;
    transactionHash?: string;
}

task("getpairs", "create pair").setAction(async()=>{
    let provider = new Web3.providers.HttpProvider(`${process.env.META_MASK_PROVIDER_URL}`);
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(abi, `${process.env.GET_PAIR_ADDRESS}`);
    let pairLength = await contract.methods.getPairsLength().call();
    let data = await contract.methods.getData().call();
    console.log(pairLength, data);
})


task("createpair", "create pair").setAction(async()=>{

    let provider = new Web3.providers.HttpProvider(`${process.env.META_MASK_PROVIDER_URL}`);
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(abi, `${process.env.GET_PAIR_ADDRESS}`);
    let data = await contract.methods.createPair().encodeABI();
    let sign:SignedTransaction = await web3.eth.accounts.signTransaction({
      to: process.env.GET_PAIR_ADDRESS,
      gas: 10000000,
      data: data
    }, `${process.env.PRIVATE_KEY}`);
    let rawTransaction = sign.rawTransaction as string;
    try{
    let createPairsTransaction = await web3.eth.sendSignedTransaction(rawTransaction);
    console.log(createPairsTransaction);
  }catch(e:any){
    console.log(e.message);
  }
})

task("addl", "Add ETH/SOME_TOKEN liquidity").setAction(async ()=>{
  let provider = new Web3.providers.HttpProvider(`${process.env.META_MASK_PROVIDER_URL}`);
  let web3 = new Web3(provider);
  let contract = new web3.eth.Contract(liq.abi, `${process.env.ADD_LIQUIDITY}`);
  let token = "0x053543EfB739A2E5e0B5c4853908E9a1B9EDf8C7";
  let amountDesired = String(10**19);
  let amountMin = String(10**19);
  let etherAmount = String(10**18);
  let to = process.env.PUBLIC_KEY;
  let deadline = 2200000000000;
  let data = await contract.methods.addLiquidityETH(
     token,amountDesired,amountMin,etherAmount,to,deadline
  ).encodeABI();
  let sign:SignedTransaction = await web3.eth.accounts.signTransaction({
    to: process.env.ADD_LIQUIDITY,
    value: web3.utils.toWei(String(10**18), "wei"),
    gas: 10000000,
    data: data
  }, `${process.env.PRIVATE_KEY}`);
  let rawTransaction = sign.rawTransaction as string;
  try{
  let addLiqTrans = await web3.eth.sendSignedTransaction(rawTransaction);
  console.log(addLiqTrans);
}catch(e:any){
  console.log(e.message);
}
})

task("addliquidity", "Add ETH/SOME_TOKEN liquidity").setAction(async ()=>{
  let provider = new Web3.providers.HttpProvider(`${process.env.META_MASK_PROVIDER_URL}`);
  let web3 = new Web3(provider);
  let contract = new web3.eth.Contract(uniswap.abi, `${process.env.V2_ROUTER}`);
  let token = "0x053543EfB739A2E5e0B5c4853908E9a1B9EDf8C7";
  let amountDesired = String(10**19);
  let amountMin = String(9**19);
  let etherAmount = String(9**18);
  let to = process.env.PUBLIC_KEY;
  let deadline = "20000000000000000";
  let data = await contract.methods.addLiquidityETH(
     token,amountDesired,amountMin,etherAmount,to,deadline
  ).encodeABI();
  let sign:SignedTransaction = await web3.eth.accounts.signTransaction({
    to: process.env.V2_ROUTER,
    value: String(10**18),
    gas: 10000000,
    data: data
  }, `${process.env.PRIVATE_KEY}`);
  let rawTransaction = sign.rawTransaction as string;
  try{
  let addLiqTrans = await web3.eth.sendSignedTransaction(rawTransaction);
  console.log(addLiqTrans);
}catch(e:any){
  console.log(e);
}
})

task("createpair", "create pair").setAction(async()=>{
  let provider = new Web3.providers.HttpProvider(`${process.env.META_MASK_PROVIDER_URL}`);
  let web3 = new Web3(provider);
  let contract = new web3.eth.Contract(factory.abi, `${process.env.FACTORY_ADDRESS}`);
  let data = await contract.methods.createPair(process.env.MY_ERC20, process.env.ETH_ADDRESS).encodeABI();
  let sign:SignedTransaction = await web3.eth.accounts.signTransaction({
    to: process.env.FACTORY_ADDRESS,
    //value: String(10**18),
    gas: 10000000,
    data: data
  }, `${process.env.PRIVATE_KEY}`);
  let rawTransaction = sign.rawTransaction as string;
  let transaction = await web3.eth.sendSignedTransaction(rawTransaction);
  console.log(transaction);
})

module.exports = {

}
