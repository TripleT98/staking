import {contract, web3, task, getSign, envParams} from "./tasks";

type tArgsType = {
  gaslimit: string;
  amount: string;
  privatekey: string;
}

function claimTask(){
  task("claim", "Claim tokens from contract").addParam("gaslimit", "gaslimit").addParam("privatekey", "Private key").addParam("amount", "Amount of claim").setAction(async(tArgs:tArgsType)=>{
    try{
      let {gaslimit, amount, privatekey} = tArgs;
      let data = await contract.methods.claim(amount).encodeABI();
      let sign = await getSign({gaslimit,data,privatekey});
      let transaction = await web3.eth.sendSignedTransaction(sign.rawTransaction);
    }catch(e:any){
      console.log(e.message);
    }
  })
}

module.exports = {
  claimTask
}
