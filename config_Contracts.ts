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
export const ADDRESS_SELL_TOKEN = "0x3D73BDf010a2853A91F50311b579fCE32B6Dfe25";
//*contract LoopToken address
export const ADDRESS_LOOP_TOKEN = "0x5389bEc8fE9BF58Ee79c5315082E01A791a639Aa";
