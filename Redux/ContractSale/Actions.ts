import { ActionTypeContractSale } from "./ActionType";

interface BalanceContractETH {
  type: ActionTypeContractSale.BALANCE_CONTRACT_SALE_ETH;
  payload: any;
}
interface BalanceContractLoop {
  type: ActionTypeContractSale.BALANCE_CONTRACT_SALE_LOOP;
  payload: any;
}
interface TokenPrice {
  type: ActionTypeContractSale.TOKEN_PRICE;
  payload: any;
}
interface TokenSold {
  type: ActionTypeContractSale.TOKEN_SOLD;
  payload: any;
}
interface Usd {
  type: ActionTypeContractSale.USD;
  payload: any;
}
export type ActionsContractSale =
  | BalanceContractETH
  | BalanceContractLoop
  | TokenPrice
  | TokenSold
  | Usd;
