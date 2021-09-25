
const LoopToken = artifacts.require("LoopToken");
module.exports =  async(deployer)=> {
     const totalSupply = 2000000;
     deployer.deploy(LoopToken,totalSupply);
};