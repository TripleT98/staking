let {stakeTask} = require("./stake.ts")
let {claimTask} = require("./claim.ts")
let {unstakeTask} = require("./unstake.ts")
let {getStakeholder} = require("./getStakeholder.ts")
let {claimAllTask} = require("./claimAll.ts")
let {unstakeAllTask} = require("./unstakeAll.ts")
require("./anotherTasks.ts");

claimTask();
unstakeTask();
stakeTask();
getStakeholder();
claimAllTask();
unstakeAllTask();

module.exports = {

}
