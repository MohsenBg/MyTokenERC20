import { ActionsContractSale as Actions } from "./Actions";
import { ActionTypeContractSale as ActionType } from "./ActionType";

const initialState = {
  BalanceETH: "0",
  BalanceLoopToken: "0",
  TokenPrice: "",
  TokenSold: "",
};

export const reducerContractSale = (state = initialState, actions: Actions) => {
  switch (actions.type) {
    case ActionType.BALANCE_CONTRACT_SALE_ETH:
      return { ...state, BalanceETH: actions.payload };
    case ActionType.BALANCE_CONTRACT_SALE_LOOP:
      return { ...state, BalanceLoopToken: actions.payload };
    case ActionType.TOKEN_PRICE:
      return { ...state, TokenPrice: actions.payload };
    case ActionType.TOKEN_SOLD:
      return { ...state, TokenSold: actions.payload };
    default:
      return state;
  }
};
