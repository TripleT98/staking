let { expect } = require("chai");
let hre = require("hardhat");
let {ethers} = hre;
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Signer, Contract, ContractFactory, BigNumber } from "ethers";
let Web3 = require("web3");

type StakeholderParams = {
  stake: string;
  timestamp: string;
  reward: string;
  exist: boolean;
}

function getStakeholderParams(params:any[]):StakeholderParams {
  return {
    stake: String(params[0]),
    timestamp: String(params[1]),
    reward: String(params[2]),
    exist: params[3],
  }
}

describe("Testing staking contract", async()=>{
  let Staking: ContractFactory, staking: Contract, addrStaking: string, owner: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, user3: SignerWithAddress, myERC20_contract: Contract,MyERC20_Factory: ContractFactory, Reward_token:ContractFactory,addrReward: string, addrLP: string, reward_token: Contract, web3: any;

  async function increaseTime(time:any) {
   await web3.currentProvider._sendJsonRpcRequest({
     jsonrpc: '2.0',
     method: 'evm_increaseTime',
     params: [time],
     id: 0,
   }, () => {console.log("increace done!")});
   await web3.currentProvider._sendJsonRpcRequest({
     jsonrpc: '2.0',
     method: 'evm_mine',
     params: [],
     id: 0,
   }, () => {console.log("mining done!")});
   }

  let mintVal: string = String(10**20);
  let stakeVal: string = String(Math.ceil(Math.random()*10)*10**18);

  beforeEach(async ()=>{
    [owner, user1, user2, user3] = await ethers.getSigners();

    MyERC20_Factory = await ethers.getContractFactory("MyERC20");
    myERC20_contract = await MyERC20_Factory.connect(owner).deploy();
    await myERC20_contract.deployed();
    addrLP = myERC20_contract.address;

    Reward_token = await ethers.getContractFactory("MyERC20");
    reward_token = await Reward_token.connect(owner).deploy();
    await reward_token.deployed();
    addrReward = reward_token.address;

    Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.connect(owner).deploy(addrLP, addrReward);
    await staking.deployed();
    addrStaking = staking.address;

      await myERC20_contract.connect(owner).mint(owner.address, mintVal);
      await myERC20_contract.connect(owner).mint(user1.address, mintVal);
      await myERC20_contract.connect(owner).mint(user2.address, mintVal);
      await myERC20_contract.connect(owner).mint(user3.address, mintVal);
      await myERC20_contract.connect(user1).approve(staking.address, mintVal);
      await myERC20_contract.connect(user2).approve(staking.address, mintVal);
      await myERC20_contract.connect(user3).approve(staking.address, mintVal);
      await myERC20_contract.connect(owner).approve(staking.address, mintVal);
      await reward_token.connect(owner).mint(staking.address, mintVal);

      hre.Web3 = Web3;
      hre.web3 = new Web3(hre.network.provider);
      web3 = hre.web3;
  })

  it("Testing stake function", async()=>{
    expect(1).to.equal(1);
    await staking.connect(user1).stake(stakeVal);
    let stakeholder = await staking.getStakeholder(user1.address);
    let stParams:StakeholderParams = getStakeholderParams(stakeholder);
    expect(String(stakeVal)).to.equal(String(stParams.stake));
    let rewardShare = await staking.rewardShare();
    expect((Number(stakeVal)/100)*rewardShare).to.equal(Number(stParams.reward));
  })
  it("Testing rewardTime, freezeTime, rewardShare setters ", async()=>{
    let rt = 700000,ft = 1100000, rs = 30;
    await staking.setRewardTime(700000);
    await staking.setFreezeTime(1100000);
    await staking.setRewardShare(30);
    expect(await staking.rewardTime()).to.equal(rt);
    expect(await staking.freezeTime()).to.equal(ft);
    expect(await staking.rewardShare()).to.equal(rs);
  })

 it("testing claim function", async()=>{
    await staking.connect(user1).stake(stakeVal);
    await increaseTime(700000);
    await staking.connect(user1).claim(String(Number(stakeVal)/10));
    await staking.getStakeholder(user1.address)
 })

it("testing claimAll function", async()=>{
   await staking.connect(user1).stake(stakeVal);
   await increaseTime(700000);
   await staking.connect(user1).claimAll();
   let stakeholder = await staking.getStakeholder(user1.address);
   let stParams:StakeholderParams = getStakeholderParams(stakeholder);
   let reward = stParams.reward;
   expect(reward).to.equal("0");
})

it("testing getStakeholder function", async()=>{
  let dval2:string = String(Number(stakeVal)/2);
  await staking.connect(user1).stake(stakeVal);
  await staking.connect(user2).stake(dval2);
  let stakeholder1:StakeholderParams = getStakeholderParams(await staking.getStakeholder(user1.address));
  let stakeholder2:StakeholderParams = getStakeholderParams(await staking.getStakeholder(user2.address));
  expect([stakeVal, String(Number(stakeVal)*0.2)]).to.deep.equal([stakeholder1.stake, stakeholder1.reward]);
  expect([dval2, String(Number(dval2)*0.2)]).to.deep.equal([stakeholder2.stake, stakeholder2.reward]);
})

it("testing unstake function", async()=>{
  await staking.connect(user1).stake(stakeVal);
  let stake_before = getStakeholderParams(await staking.getStakeholder(user1.address)).stake;
  await increaseTime(1300000);
  await staking.connect(user1).unstake(String(Number(stakeVal)/2));
  let stake_after = getStakeholderParams(await staking.getStakeholder(user1.address)).stake;
  expect(Number(stake_before)).to.equal(Number(stake_after)*2)
})

it("testing unstakeAll function", async()=>{
  await staking.connect(user1).stake(stakeVal);
  await increaseTime(1300000);
  await staking.connect(user1).unstakeAll();
  let stake_after = getStakeholderParams(await staking.getStakeholder(user1.address)).stake;
  expect("0").to.equal(stake_after);
})

describe("testing reverts with error", async()=>{
  it("Testing claim function", async()=>{
    let err_mess: string = "U have no reward tokens yet!";
    let err_mess2: string = "You haven't such a big value of reward tokens";
    await staking.connect(user1).stake(stakeVal);
    await expect(staking.connect(user1).claimAll()).to.be.revertedWith(err_mess);
    await expect(staking.connect(user1).claim(stakeVal + 1)).to.be.revertedWith(err_mess2);
  })
  it("Testing unstake function", async()=>{
    let err_mess: string = "You have no stake tokens.";
    let err_mess2: string = "You have no such a big amount of stake tokens.";
    let err_mess3: string = "U cant get back your reward tokens yet!";
    await staking.connect(user1).stake(stakeVal);
    await expect(staking.connect(user2).unstake(stakeVal)).to.be.revertedWith(err_mess);
    await expect(staking.connect(user2).unstakeAll()).to.be.revertedWith(err_mess);
    await expect(staking.connect(user1).unstake(stakeVal + 1)).to.be.revertedWith(err_mess2);
    await expect(staking.connect(user1).unstake(stakeVal)).to.be.revertedWith(err_mess3);
  })
})
})
