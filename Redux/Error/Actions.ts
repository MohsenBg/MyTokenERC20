import { ActionTypeError as ActionType } from "./ActionType";

interface onError {
  type: ActionType.ON_ERROR;
  title: string;
  text: string;
  icon: string;
  countBtn: number;
  btn1: string;
  btn2: string;
  hidden: boolean;
  fontSize: string;
  zIndex: number;
  ErrorType: string;
}
interface endError {
  type: ActionType.END_ERROR;
}

export type ActionsError = onError | endError;
