import {contract, web3, task, getSign, envParams, lptoken} from "./tasks";

type tArgsType = {
  gaslimit: string;
  amount: string;
  privatekey: string;
}

function stakeTask(){
  task("stake", "Stake tokens to contract").addParam("gaslimit", "gaslimit").addParam("privatekey", "Private key").addParam("amount", "Amount of stake").setAction(async(tArgs:tArgsType)=>{
    try{
      let {gaslimit, amount, privatekey} = tArgs;

      let allowance_data = await lptoken.methods.approve(envParams.STAKING_ADDRESS, amount).encodeABI();
      let allowance_sign = await getSign({gaslimit,data:allowance_data,privatekey});
      let allowance_transaction = await web3.eth.sendSignedTransaction(allowance_sign.rawTransaction);
      console.log("Approve: success!", allowance_transaction.transactionHash);
      await lptoken.methods.allowance(envParams.PUBLIC_KEY, envParams.STAKING_ADDRESS);
      let data = await contract.methods.stake(amount).encodeABI();
      let sign = await getSign({gaslimit,data,privatekey}, true);
      let transaction = await web3.eth.sendSignedTransaction(sign.rawTransaction);
      console.log("Staking: success!", transaction.transactionHash);

    }catch(e:any){
      console.log(e.message);
    }
  })
}

module.exports = {
  stakeTask
}
