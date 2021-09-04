import { ActionTypeError as ActionType } from "./ActionType";
import { ActionsError as Actions } from "./Actions";

const initialState = {
  title: "",
  text: "",
  icon: "error",
  countBtn: 0,
  btn1: "",
  btn2: "",
  hidden: true,
  fontSize: "16px",
  zIndex: 10,
  ErrorType: "",
};

export const reducerError = (state = initialState, action: Actions) => {
  switch (action.type) {
    case ActionType.ON_ERROR:
      return {
        ...state,
        title: action.title,
        btn1: action.btn1,
        btn2: action.btn2,
        text: action.text,
        icon: action.icon,
        countBtn: action.countBtn,
        hidden: action.hidden,
        fontSize: action.fontSize,
        zIndex: action.zIndex,
        ErrorType: action.ErrorType,
      };
    case ActionType.END_ERROR:
      return {
        ...state,
        title: "",
        text: "",
        icon: "error",
        countBtn: 0,
        btn1: "",
        btn2: "",
        hidden: true,
        fontSize: "16px",
        zIndex: 10,
        ErrorType: "",
      };
    default:
      return state;
  }
};
