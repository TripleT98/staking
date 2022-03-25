import {contract, web3, task, getSign, envParams} from "./tasks";

type tArgsType = {
  gaslimit: string;
  privatekey: string;
}

function claimAllTask(){
  task("claimall", "Claim all tokens from contract").addParam("gaslimit", "gaslimit").addParam("privatekey", "Private key").setAction(async(tArgs:tArgsType)=>{
    try{
      let {gaslimit, privatekey} = tArgs;
      let data = await contract.methods.claimAll().encodeABI();
      let sign = await getSign({gaslimit,data,privatekey});
      let transaction = await web3.eth.sendSignedTransaction(sign.rawTransaction);
    }catch(e:any){
      console.log(e.message);
    }
  })
}

module.exports = {
  claimAllTask
}
