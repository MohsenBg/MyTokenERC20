import Json_Sell from "./Truffle/build/contracts/LoopTokenSale.json";
import Json_Loop_Token from "./Truffle/build/contracts/LoopToken.json";

//contract LoopTokenSale Abi
export const ABI_SELL_CONTRACT = Json_Sell.abi;
//contract LoopToken Abi
export const ABI_LOOP_TOKEN_CONTRACT = Json_Loop_Token.abi;

//localhost:8585
//contract LoopTokenSale address
//export const ADDRESS_SELL_TOKEN = Json_Sell.networks[200113].address;
//contract LoopToken address
//export const ADDRESS_LOOP_TOKEN = Json_Loop_Token.networks[200113].address;

//Rinkeby
//contract LoopTokenSale address
export const ADDRESS_SELL_TOKEN = "0xFD552D56e4aeB53643e57e150CeBaA809B5eB393";
//contract LoopToken address
export const ADDRESS_LOOP_TOKEN = "0x540C09BE381851E307495E06d2c488bD40CaA008";
