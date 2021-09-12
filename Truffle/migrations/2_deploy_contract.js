
const Products = artifacts.require("Products");
module.exports =  async(deployer)=> {
     deployer.deploy(Products);
};