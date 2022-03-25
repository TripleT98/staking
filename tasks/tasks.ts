import Web3 from "web3";
import * as dotenv from "dotenv";
import {task} from "hardhat/config";
import {provider as Provider} from "web3-core/types/index.d"
dotenv.config();
let {abi} = require("./../artifacts/contracts/staking.sol/Staking.json");


//let provider = new Web3.providers.HttpProvider(`${process.env.}`)
