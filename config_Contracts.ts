import Json_Sell from "./Truffle/build/contracts/LoopTokenSale.json";
import Json_Loop_Token from "./Truffle/build/contracts/LoopToken.json";
import Json_Products from "./Truffle/build/contracts/Products.json";
//contract LoopTokenSale Abi
export const ABI_SELL_CONTRACT = Json_Sell.abi;
//contract LoopToken Abi
export const ABI_LOOP_TOKEN_CONTRACT = Json_Loop_Token.abi;
//contract Products Abi
export const ABI_PRODUCTS = Json_Products.abi;

//!localhost:8585
//*contract LoopTokenSale address
//export const ADDRESS_SELL_TOKEN = Json_Sell.networks[200113].address;
//*contract LoopToken address
//export const ADDRESS_LOOP_TOKEN = Json_Loop_Token.networks[200113].address;
//*contract LoopToken address
//export const ADDRESS_PRODUCTS = Json_Products.networks[200113].address;

//!Rinkeby
//*contract LoopTokenSale address
export const ADDRESS_SELL_TOKEN = "0x9933F9c1b0c20F281b5aE5E629d1344BfeC27bca";
//*contract LoopToken address
export const ADDRESS_LOOP_TOKEN = "0x15F536c97cD561D9867a5186915F032005B4263E";
//*contract LoopToken address
export const ADDRESS_PRODUCTS = "0x3d3dF2847AE3223Dc54048FD520fCfbEAA5812BD";
