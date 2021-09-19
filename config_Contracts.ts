import Json_Sell from "./Truffle/build/contracts/LoopTokenSale.json";
import Json_Loop_Token from "./Truffle/build/contracts/Products.json";

//contract LoopTokenSale Abi
export const ABI_SELL_CONTRACT = Json_Sell.abi;
//contract LoopToken Abi
export const ABI_LOOP_TOKEN_CONTRACT = Json_Loop_Token.abi;

//!localhost:8585
//*contract LoopTokenSale address
//export const ADDRESS_SELL_TOKEN = Json_Sell.networks[200113].address;
//*contract LoopToken address
//export const ADDRESS_LOOP_TOKEN = Json_Loop_Token.networks[200113].address;

//!Rinkeby
//*contract LoopTokenSale address
export const ADDRESS_SELL_TOKEN = "0x3C3ea359F335C1dF1d1294468A58D3aa28beD226";
//*contract LoopToken address
export const ADDRESS_LOOP_TOKEN = "0x9c13e0eEbED01ad4B7bD7Cd90A2Ac6Dee19dFC73";
