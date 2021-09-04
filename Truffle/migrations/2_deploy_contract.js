const LoopToken = artifacts.require("LoopToken");
const LoopTokenSale = artifacts.require("LoopTokenSale");

module.exports =  async(deployer)=> {
   const totalSupply = 2000000;
   deployer.deploy(LoopToken,totalSupply);
};
