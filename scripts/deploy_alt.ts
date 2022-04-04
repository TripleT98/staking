import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  let rewardToken = process.env.MY_ERC20 as string;
  let stakingToken = process.env.PAIR_ADDRESS as string;
  const Staking = await ethers.getContractFactory("AltStaking");
  const staking = await Staking.deploy(stakingToken, rewardToken);
  await staking.deployed();
  console.log("Staking deployed to:", staking.address);
}


main().then((data) => {
  process.exitCode = 0;
}, (error)=>{
  console.log(error);
  process.exitCode = 1;
});
