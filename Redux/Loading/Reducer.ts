import { ActionsLoading as Actions } from "./ActionType";
import { ActionTypeLoading as ActionType } from "./Actions";

const initialState = {
  Loading: false,
};

export const reducerLoading = (state = initialState, actions: Actions) => {
  switch (actions.type) {
    case ActionType.ON_LOADING:
      return { ...state, Loading: true };
    case ActionType.END_LOADING:
      return { ...state, Loading: false };
    default:
      return state;
  }
};
