import { ActionsAccountInfo as Actions } from "./../Actions/Actions";
import { ActionTypeAccountInfo as ActionType } from "../ActionType/ActionType";

const initialState = {
  addressAccounts: [],
  balance: "",
  ChainId: "",
  approval: "",
  Web3: "",
};

export const reducerAccountInfo = (state = initialState, action: Actions) => {
  switch (action.type) {
    case ActionType.ACCOUNT_ADDRESS:
      return { ...state, addressAccounts: action.payload };
    case ActionType.ACCOUNT_BALANCE:
      return { ...state, balance: action.payload };
    case ActionType.CHAIN_ID:
      return { ...state, ChainId: action.payload };
    case ActionType.WEB3:
      return { ...state, Web3: action.payload };
    case ActionType.APPROVAL:
      return { ...state, approval: action.payload };
    default:
      return state;
  }
};
