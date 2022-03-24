import { ethers } from "hardhat";

async function main() {
  let factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  let token1 = "0x053543EfB739A2E5e0B5c4853908E9a1B9EDf8C7";
  let token2 = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
  const CreatePair = await ethers.getContractFactory("CreatePair");
  const createPair = await CreatePair.deploy(token1,token2,factory);
  await createPair.deployed();
  console.log("CreatePair deployed to:", createPair.address);
  /*const GetTokenNames = await ethers.getContractFactory("getTokenNames");
  const getTokenNames = await GetTokenNames.deploy();
  await getTokenNames.deployed();
  console.log("GetTokenNames deployed to:", getTokenNames.address);*/

  /*const AddLiquidity = await ethers.getContractFactory("addLiquidity");
  const addLiquidity = await AddLiquidity.deploy();
  await addLiquidity.deployed();
  console.log("addLiquidity deployed to:", addLiquidity.address);*/
}


main().then((data) => {
  process.exitCode = 0;
}, (error)=>{
  console.log(error);
  process.exitCode = 1;
});
