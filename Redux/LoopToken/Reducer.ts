import { ActionTypeLoopToken as ActionType } from "./ActionType";
import { ActionLoopToken as Actions } from "./Actions";

const initialState = {
  balance: 0,
};

export const reducerLoopToken = (state = initialState, action: Actions) => {
  switch (action.type) {
    case ActionType.BALANCE:
      return { ...state, balance: action.balance };

    default:
      return state;
  }
};
