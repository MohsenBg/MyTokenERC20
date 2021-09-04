import React, { useEffect, useRef, useState } from "react";
import styles from "./SendETH.module.scss";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { useDispatch, useSelector } from "react-redux";
import { initialState } from "../../Redux/store";
import { AiFillCheckCircle, AiOutlineSync } from "react-icons/ai";
import EtherImg from "../../public/assets/other/Ethereum-Logo.wine.svg";
import Image from "next/image";
import { ActionTypeAccountInfo } from "../../Redux/AccountInfo/ActionType/ActionType";
import { NumbersKeys } from "../KeyCode/KeyCode";
import TextareaAutosize from "react-textarea-autosize";
import { BiArrowBack } from "react-icons/bi";
import Link from "next/link";
import { ActionTypeError } from "../../Redux/Error/ActionType";
import { ErrorTypes } from "../Error/ErrorType/ErrorType";
import { useRouter } from "next/dist/client/router";
const SendETH = () => {
  const dispatch = useDispatch();
  const [accountBalance, setAccountBalance] = useState(0);
  const [addressTo, setAddressTo] = useState("");
  const [focus, setFocus] = useState(false);
  const [warning, setWarning] = useState("");
  const [balanceTransfer, setBalanceTransfer] = useState<any>("0");
  const [sizeWidth, setSizeWidth] = useState(30);
  const [gasPrice, setGasPrice] = useState<any>();
  const [gasLimit, setGasLimit] = useState<any>();

  const router = useRouter();

  const userAccount = useSelector(
    (state: typeof initialState) => state.AccountData.addressAccounts
  );
  const chainId = useSelector(
    (state: typeof initialState) => state.AccountData.ChainId
  );
  const Balance = useSelector(
    (state: typeof initialState) => state.AccountData.balance
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
          // const block = web3.eth.getBlock("latest");
          // let currGas: any = (await block).gasLimit;
          setGasLimit(21000);
          setGasPrice(20);
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
  useEffect(() => {
    convert(Balance);
  }, [userAccount, Balance]);
  const convert = async (value: any) => {
    let number = value;
    const provider: any = await detectEthereumProvider();
    if (provider) {
      if (userAccount.length >= 1) {
        const web3 = new Web3(provider);
        const balance = await web3.eth.getBalance(userAccount[0]);
        dispatch({
          type: ActionTypeAccountInfo.ACCOUNT_BALANCE,
          payload: balance,
        });
        const ether = web3.utils.fromWei(Balance, "ether");
        number = ether;
        setAccountBalance(number);
      }
    }
  };

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
      if (userAccount.length >= 1) {
        const gasLimitHex = web3.utils.toHex(gasLimit.toString());
        const BalanceTransferWei = web3.utils.toWei(
          balanceTransfer.toString(),
          "ether"
        );
        const BalanceTransferHex = web3.utils.toHex(BalanceTransferWei);
        const transactionParameters = {
          nonce: "0x00",
          gasPrice: web3.utils.toHex(`${gasPrice}000000000`),
          gas: gasLimitHex,
          to: `${addressTo}`,
          from: `${userAccount}`,
          value: BalanceTransferHex,
          chainId: web3.utils.toHex(chainId),
        };

        await provider
          .request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
          })
          .then(async (txHash: any) => {
            await web3.eth.getTransaction(
              txHash,
              (error: Error, transaction: any) => {
                if (error) {
                  console.log(error);
                }
                if (transaction) {
                  console.log(transaction);
                  router.push("/wallet", undefined, { shallow: false });
                }
              }
            );
          })
          .catch((error: any) => {
            if (error.code === 4001) {
              console.log(error);
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
          });
      }
    }
  };

  const handelMaxBtn = async () => {
    const provider: any = await detectEthereumProvider();
    const web3: Web3 = new Web3(provider);
    const gasPriceToWei = `${gasPrice}000000000`;
    const gasPriceToEther = web3.utils.fromWei(gasPriceToWei, "ether");
    const BalanceToEther = web3.utils.fromWei(`${Balance - 100000}`, "ether");
    const TotalGas = gasLimit * parseFloat(gasPriceToEther);
    console.log(TotalGas);
    const maxBalance = parseFloat(BalanceToEther) - TotalGas;

    onBalanceTransferChange(maxBalance);
  };

  const onBalanceTransferChange = async (value: any) => {
    value = value.toString();
    setBalanceTransfer(value);
    if (value.length <= 18 && value.length !== 0) {
      setSizeWidth(30 + value.length * 8);
    }
    if (value.length === 0) {
      setBalanceTransfer("0");
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
                          src={EtherImg}
                          alt="WallEtherImg"
                          height="80px"
                          width="80px"
                        />
                      </div>
                      <div className={styles.tokenTexts}>
                        <div className={styles.NameToken}>Ethereum</div>
                        <div className={styles.balanceToken}>
                          Balance: {accountBalance} <span>ETH</span>
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
                            //@ts-ignore
                            oncontextmenu={false}
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
                              }}
                              onChange={(e) =>
                                onBalanceTransferChange(e.target.value)
                              }
                            />
                          </div>
                          <span>ETH</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.gasContainer}>
                    <div className={styles.gasPrice}>
                      <div className={styles.text}>
                        <span className={styles.mainText}>gasPrice</span>
                        <span className={styles.uint}> (Gwei)</span>
                      </div>

                      <div>
                        <input
                          className={styles.inputGas}
                          type="number"
                          name="gasPrice"
                          onChange={(e) => setGasPrice(e.target.value)}
                          value={gasPrice}
                        />
                      </div>
                    </div>
                    <div className={styles.gasLimit}>
                      <div className={styles.text}>
                        <span className={styles.mainText}>gasLimit</span>
                      </div>
                      <div>
                        <input
                          readOnly={true}
                          className={styles.inputGas}
                          type="number"
                          name="gasLimit"
                          value={gasLimit}
                        />
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

export default SendETH;
