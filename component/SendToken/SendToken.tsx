import detectEthereumProvider from "@metamask/detect-provider";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import { ActionTypeAccountInfo } from "../../Redux/AccountInfo/ActionType/ActionType";
import { ActionTypeError } from "../../Redux/Error/ActionType";
import { initialState } from "../../Redux/store";
import { ErrorTypes } from "../Error/ErrorType/ErrorType";
import { NumbersKeys } from "../KeyCode/KeyCode";
import styles from "./SendTokenComponent.module.scss";
import TextareaAutosize from "react-textarea-autosize";
import Image from "next/image";
import { AiFillCheckCircle } from "react-icons/ai";
import { TokenList } from "../Token/TokenItems";
import {
  ABI_LOOP_TOKEN_CONTRACT,
  ABI_SELL_CONTRACT,
  ADDRESS_LOOP_TOKEN,
  ADDRESS_SELL_TOKEN,
} from "../../config_Contracts";

interface Props {
  params: any;
}

const SendTokenComponent: React.FunctionComponent<Props> = ({ params }) => {
  const TokenSelected = TokenList.filter((tokens) => tokens.Name === params);

  const dispatch = useDispatch();
  const [accountBalance, setAccountBalance] = useState(0);
  const [addressTo, setAddressTo] = useState("");
  const [focus, setFocus] = useState(false);
  const [warning, setWarning] = useState("");
  const [balanceTransfer, setBalanceTransfer] = useState<any>("0");
  const [sizeWidth, setSizeWidth] = useState(30);

  const router = useRouter();

  const userAccount = useSelector(
    (state: typeof initialState) => state.AccountData.addressAccounts
  );
  const chainId = useSelector(
    (state: typeof initialState) => state.AccountData.ChainId
  );
  const Balance = useSelector(
    (state: typeof initialState) => state.LoopToken.balance
  );

  useEffect(() => {
    const AddressTo = async () => {
      const provider: any = await detectEthereumProvider();
      const web3 = new Web3(provider);
      if (provider) {
        if (userAccount.length >= 1) {
          const checkAddressReal = web3.utils.isAddress(addressTo);
          const UserAccount = userAccount[0];
          const CheckNotAddressUsed =
            UserAccount.toLowerCase() !== addressTo.toLowerCase();

          if (addressTo.length >= 1) {
            if (checkAddressReal && CheckNotAddressUsed) {
              setWarning("none");
            }
            if (!checkAddressReal) {
              setWarning("Recipient address is invalid");
            }
            if (!CheckNotAddressUsed) {
              setWarning("you can't transfer token to  same address");
            }
          } else {
            setWarning("");
          }
        }
      }
    };
    AddressTo();
  }, [addressTo, userAccount]);

  const valueSpan = (event: React.KeyboardEvent) => {
    const otherSymbol = [
      "Backspace",
      "Delete",
      "ArrowRight",
      "ArrowLeft",
      "ArrowUp",
      "ArrowDown",
    ];
    if (balanceTransfer.length > 18) {
      if (!otherSymbol.includes(event.code)) {
        event.preventDefault();
      }
    } else {
      if (event.code === "" && event.code && event)
        if (event.shiftKey) {
          event.preventDefault();
        }
      if (event.ctrlKey) {
        event.preventDefault();
      }
      if (event.altKey) {
        event.preventDefault();
      }
      if (!NumbersKeys.includes(event.code)) {
        event.preventDefault();
      }

      if (
        balanceTransfer.toString().includes(".") &&
        (event.code === "NumpadDecimal" ||
          event.code === "Digit." ||
          event.code === "Period")
      ) {
        event.preventDefault();
      }
    }
  };

  const handelNextBtn = async () => {
    const provider: any = await detectEthereumProvider();
    const web3 = new Web3(provider);
    if (provider) {
      const ContractLoopToken = await new web3.eth.Contract(
        //@ts-ignore
        ABI_LOOP_TOKEN_CONTRACT,
        ADDRESS_LOOP_TOKEN
      );
      if (userAccount.length >= 1) {
        if (parseFloat(Balance) >= parseFloat(balanceTransfer)) {
          try {
            await ContractLoopToken.methods
              .transfer(addressTo, balanceTransfer)
              .send({ from: userAccount[0] })
              .once("receipt", (receipt: any) => {
                router.push("/wallet", undefined, { shallow: false });
              });
          } catch (error: any) {
            if (error.code === 4001) {
              dispatch({
                type: ActionTypeError.ON_ERROR,
                title: "Meta Mask",
                text: "Denied transaction signature",
                icon: "error",
                countBtn: 1,
                btn1: "ok",
                btn2: "",
                hidden: false,
                fontSize: "18px",
                zIndex: 10,
                ErrorType: ErrorTypes.META_MASK_USER_DENIED_TRANSACTION,
              });
            }
          }
        }
      }
    }
  };

  const handelMaxBtn = async () => {
    onBalanceTransferChange(Balance);
  };

  const onBalanceTransferChange = async (value: any) => {
    value = value.toString();
    setBalanceTransfer(value);
    if (value.length <= 18 && value.length !== 0) {
      setSizeWidth(30 + value.length * 8);
    }
    if (value.length === 0) {
      setBalanceTransfer("0");
      setSizeWidth(30 + 1 * 8);
    }
    if (value.length > 18) {
      const convert = value.substring(0, 18);
      setBalanceTransfer(convert);
      setSizeWidth(30 + 18 * 8);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}> TransAction</h1>
        <div className={styles.panel}>
          <div className={styles.background}>
            <div className={styles.contents}>
              <Link href="/wallet">
                <div className={styles.backIcon}>
                  <BiArrowBack />
                  <span>Back</span>
                </div>
              </Link>
              <h1 className={styles.contentsTitle}>Add Recipient</h1>
              <div className={styles.address}>
                <input
                  style={
                    warning === "none"
                      ? { backgroundColor: "green" }
                      : warning === ""
                      ? { backgroundColor: "black" }
                      : { backgroundColor: "red" }
                  }
                  type="text"
                  onFocus={() => setFocus(false)}
                  onBlur={() => setFocus(true)}
                  value={
                    focus && warning === "none"
                      ? addressTo.substring(0, 5) +
                        "..." +
                        addressTo.substring(addressTo.length - 4)
                      : addressTo
                  }
                  onChange={(e) => setAddressTo(e.target.value)}
                />
                <div className={styles.checkerIcons}>
                  {warning === "none" && focus ? (
                    <div style={{ color: "rgb(171, 255, 92)" }}>
                      <AiFillCheckCircle />
                    </div>
                  ) : null}
                </div>
              </div>
              {warning === "none" ? (
                <div className={styles.transitionSettings}>
                  <div className={styles.asset}>
                    <div className={styles.assetText}>Asset:</div>
                    <div className={styles.assetCoinContainer}>
                      <div className={styles.assetCoinImg}>
                        <Image
                          src={TokenSelected[0].Img}
                          alt="tokenImg"
                          height="65px"
                          width="65px"
                        />
                      </div>
                      <div className={styles.tokenTexts}>
                        <div className={styles.NameToken}>
                          {TokenSelected[0].Name}
                        </div>
                        <div className={styles.balanceToken}>
                          Balance: {Balance}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.amount}>
                    <div className={styles.containerLeft}>
                      <div className={styles.amountText}>Amount:</div>
                      <div className={styles.MaxAmount} onClick={handelMaxBtn}>
                        Max
                      </div>
                    </div>

                    <div className={styles.amountCoinContainer}>
                      <div className={styles.tokenTexts}>
                        <div className={styles.balanceTransfer}>
                          <div
                            className={styles.textarea}
                            onKeyDown={(e) => valueSpan(e)}
                          >
                            <TextareaAutosize
                              autoFocus={true}
                              name="balanceTransfer"
                              value={balanceTransfer}
                              maxRows={1}
                              style={{
                                border: "2px ",
                                textAlign: "center",
                                resize: "none",
                                //@ts-ignore
                                width: `${sizeWidth}px`,
                                padding: "5px",
                                fontSize: "15px",
                                backgroundColor: "transparent",
                                color: "white",
                                outline: "none",
                              }}
                              onChange={(e) =>
                                onBalanceTransferChange(e.target.value)
                              }
                            />
                          </div>
                          <span>Loop</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.btnContainer} onClick={handelNextBtn}>
                    <div>Next</div>
                  </div>
                </div>
              ) : (
                <div className={styles.warning}>
                  <div
                    style={
                      addressTo.length === 0
                        ? { backgroundColor: "transparent" }
                        : {}
                    }
                  >
                    {warning}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendTokenComponent;
