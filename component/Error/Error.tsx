import React from "react";
import styles from "./Error.module.scss";
import { BiErrorAlt, BiMessageAltMinus } from "react-icons/bi";
import { AiFillWarning } from "react-icons/ai";
import { initialState } from "../../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { ErrorTypes } from "./ErrorType/ErrorType";
import { ActionTypeError } from "../../Redux/Error/ActionType";
import { useRouter } from "next/dist/client/router";
const Error = () => {
  const router = useRouter();
  //-redux
  const text = useSelector((state: typeof initialState) => state.Error.text);
  const icon = useSelector((state: typeof initialState) => state.Error.icon);
  const countButton = useSelector(
    (state: typeof initialState) => state.Error.countBtn
  );
  const btn1 = useSelector((state: typeof initialState) => state.Error.btn1);
  const hidden = useSelector(
    (state: typeof initialState) => state.Error.hidden
  );
  const btn2 = useSelector((state: typeof initialState) => state.Error.btn2);
  const fontSize = useSelector(
    (state: typeof initialState) => state.Error.fontSize
  );
  const title = useSelector((state: typeof initialState) => state.Error.title);
  const _zIndex = useSelector(
    (state: typeof initialState) => state.Error.zIndex
  );

  const ErrorType = useSelector(
    (state: typeof initialState) => state.Error.ErrorType
  );

  const dispatch = useDispatch();
  const ErrorHandel = async (ErrorType: any, accept: any) => {
    switch (ErrorType) {
      case ErrorTypes.META_MASK_NOT_INSTALL:
        dispatch({
          type: ActionTypeError.END_ERROR,
        });
        window.open("https://metamask.io/download", "_blank");
        break;
      case ErrorTypes.META_MASK_CONNECTION_REJECTED:
        dispatch({
          type: ActionTypeError.END_ERROR,
        });
        break;
      case ErrorTypes.META_MASK_USER_DENIED_TRANSACTION:
        dispatch({
          type: ActionTypeError.END_ERROR,
        });
        break;
      case ErrorTypes.WRONG_CHAIN_ID:
        dispatch({
          type: ActionTypeError.END_ERROR,
        });
        break;
      case ErrorTypes.CONNECT_YOUR_ACCOUNT:
        dispatch({
          type: ActionTypeError.END_ERROR,
        });
        break;
      case ErrorTypes.ADD_PRODUCT:
        dispatch({
          type: ActionTypeError.END_ERROR,
        });
        break;
      case ErrorTypes.PRODUCT_NOT_EXIST:
        dispatch({
          type: ActionTypeError.END_ERROR,
        });
        await router.push("/Dashboard", undefined, { shallow: false });
        break;

      default:
        break;
    }
  };

  return (
    <>
      {hidden ? null : (
        <div className={styles.container} style={{ zIndex: _zIndex }}>
          <div className={styles.box}>
            {icon === "error" ? (
              <div>
                <div className={styles.icon}>
                  <BiErrorAlt />
                </div>
                <div className={`${styles["icon"]} ${styles["iconLeft"]}`}>
                  <BiErrorAlt />
                </div>
              </div>
            ) : icon === "message" ? (
              <div>
                <div className={styles.icon}>
                  <BiMessageAltMinus />
                </div>
                <div className={`${styles["icon"]} ${styles["iconLeft"]}`}>
                  <BiMessageAltMinus />
                </div>
              </div>
            ) : icon === "warning" ? (
              <div>
                <div className={styles.icon}>
                  <AiFillWarning />
                </div>
                <div className={`${styles["icon"]} ${styles["iconLeft"]}`}>
                  <AiFillWarning />
                </div>
              </div>
            ) : null}
            <h1 className={styles.title}>{title}</h1>
            <p
              className={styles.text}
              style={{ fontSize: fontSize ? fontSize : "16px" }}
            >
              {text}
            </p>
            <div>
              {countButton == 2 ? (
                <div className={styles.buttons}>
                  <div
                    className={styles.btn}
                    onClick={() => ErrorHandel(ErrorType, true)}
                  >
                    {btn1}
                  </div>
                  <div
                    className={styles.btn}
                    onClick={() => ErrorHandel(ErrorType, false)}
                  >
                    {btn2}
                  </div>
                </div>
              ) : countButton == 1 ? (
                <div className={styles.buttons}>
                  <div
                    className={styles.btn}
                    onClick={() => ErrorHandel(ErrorType, true)}
                  >
                    {btn1}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Error;
