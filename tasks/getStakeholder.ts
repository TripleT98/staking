import {contract, web3, task, getSign, envParams} from "./tasks";

type tArgsType = {
  address: string;
}

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

function getStakeholder(){
  task("stakeholder", "get stakeholder by address").addParam("address", "stakeholder's address").setAction(async(tArgs:tArgsType)=>{
    try{
      let {address} = tArgs;
      let stakeholder: StakeholderParams  = getStakeholderParams(await contract.methods.getStakeholder(address).call());
      console.log(stakeholder);
    }catch(e:any){
      console.log(e.message);
    }
  })
}

module.exports = {
  getStakeholder
}
