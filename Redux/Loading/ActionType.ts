import { ActionTypeLoading } from "./Actions";

interface onLoading {
  type: ActionTypeLoading.ON_LOADING;
}
interface EndLoading {
  type: ActionTypeLoading.END_LOADING;
}
export type ActionsLoading = onLoading | EndLoading;
