
const LoopToken = artifacts.require("LoopToken");
module.exports =  async(deployer)=> {
     deployer.deploy(LoopToken,2000000);
};