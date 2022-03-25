import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
require("./tasks/task_root.ts");


dotenv.config();

const config: HardhatUserConfig = {
  solidity:{
    compilers:[
      {version:"0.8.0"}, {version:"0.5.16"}, {version:"0.5.0"}, {version:"0.6.0"}, {version: "0.6.6"},
    ]
  },
  networks: {
    rinkeby:{
       url:process.env.INFURA_URL,
       accounts:[`${process.env.PRIVATE_KEY}`]
     }
  },
  etherscan:{
    apiKey:{
      rinkeby: process.env.ETHERSCAN_API_KEY,
    }
  }
};

export default config;
