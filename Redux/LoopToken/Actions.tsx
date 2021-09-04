import { ActionTypeLoopToken } from "./ActionType";

interface balance {
  type: ActionTypeLoopToken.BALANCE;
  balance: any;
}

export type ActionLoopToken = balance;
