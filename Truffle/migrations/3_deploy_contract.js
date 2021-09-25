const LoopToken = artifacts.require("LoopToken");
const LoopTokenSale = artifacts.require("LoopTokenSale");

module.exports =  async(deployer)=> {
     const tokenPrice = 300000000000000;//wei
     const Math = 3000;
     deployer.deploy(LoopTokenSale,LoopToken.address,tokenPrice,Math);
};