import detectEthereumProvider from "@metamask/detect-provider";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import {
  ABI_LOOP_TOKEN_CONTRACT,
  ABI_SELL_CONTRACT,
  ADDRESS_LOOP_TOKEN,
  ADDRESS_SELL_TOKEN,
} from "../../config_Contracts";
import { ActionTypeContractSale } from "../../Redux/ContractSale/ActionType";
import { initialState } from "../../Redux/store";
import styles from "./BuyLoopToken.module.scss";
const BuyLoopToken = () => {
  const [warning, setWarning] = useState<any>("");
  const [countToken, setCountToken] = useState<any>("0");
  const currentAccount = useSelector(
    (state: typeof initialState) => state.AccountData.addressAccounts
  );
  const tokenPrice = useSelector(
    (state: typeof initialState) => state.ContractSale.TokenPrice
  );

  const [renderBalance, setRenderBalance] = useState<any>([
    { id: 1, value: 0 },
  ]);
  const [tokenPriceEth, setTokenPriceEth] = useState<any>(null);

  const balanceOfContract = useSelector(
    (state: typeof initialState) => state.ContractSale.BalanceLoopToken
  );
  const router = useRouter();
  useEffect(() => {
    convert();
  }, [tokenPrice]);
  const dispatch = useDispatch();
  const time = 2000;
  useEffect(() => {
    const interval = setInterval(async () => {
      const provider: any = await detectEthereumProvider();
      const web3 = new Web3(provider);
      if (provider) {
        if (currentAccount.length >= 1) {
          const ContractLoopToken = new web3.eth.Contract(
            //@ts-ignore
            ABI_LOOP_TOKEN_CONTRACT,
            ADDRESS_LOOP_TOKEN
          );
          const BalanceOFLoop = await ContractLoopToken.methods
            .balanceOf(ADDRESS_SELL_TOKEN)
            .call();
          if (BalanceOFLoop !== balanceOfContract) {
            dispatch({
              type: ActionTypeContractSale.BALANCE_CONTRACT_SALE_LOOP,
              payload: BalanceOFLoop,
            });
          }
        }
      }
    }, time);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    BalanceOfContract();
  }, [balanceOfContract]);
  const BalanceOfContract = async () => {
    let numbers = [];
    for (let i = 0; i < balanceOfContract.length; i++) {
      let chart = balanceOfContract.charAt(i);
      numbers.push({
        id: i,
        value: chart,
      });
    }
    setRenderBalance(numbers);
  };
  //CheckValueInputCorrect
  useEffect(() => {
    const toNumber = parseFloat(countToken);
    if (!(toNumber % 1 === 0)) {
      setWarning("value Is Not Integer");
    } else {
      if (parseInt(balanceOfContract) < parseInt(countToken)) {
        setWarning("value Is More than tokens");
      } else if (parseInt(countToken) < 0) {
        setWarning("value can't be under zero");
      } else {
        setWarning("");
      }
    }
  }, [countToken]);

  const convert = async () => {
    const Provider: any = await detectEthereumProvider();
    const web3 = new Web3(Provider);
    if (Provider) {
      const newValue = web3.utils.fromWei(tokenPrice, "ether");
      setTokenPriceEth(newValue);
    }
  };
  const handelNextBtn = async () => {
    const provider: any = await detectEthereumProvider();
    if (provider) {
      const web3 = new Web3(provider);
      const ContractSale = new web3.eth.Contract(
        //@ts-ignore
        ABI_SELL_CONTRACT,
        ADDRESS_SELL_TOKEN
      );
      const Value = (parseFloat(tokenPrice) * countToken).toString();
      await ContractSale.methods
        .buyToken(countToken)
        .send({ from: currentAccount[0], value: Value })
        .once("receipt", (receipt: any) => {
          router.push("/wallet", undefined, { shallow: false });
        });
    }
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Buy Loop Token</h1>
      <div className={styles.main_content}>
        <div className={styles.balanceContent}>
          {parseFloat(balanceOfContract) > 0 ? (
            <div className={styles.balance}>
              {renderBalance.map((item: any) => (
                <div key={item.id} className={styles.balanceContainer}>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noToken}>There is No Token for sale Now</div>
          )}
        </div>
        <div className={styles.card}>
          <div className={styles.containerAmount}>
            <div className={styles.titleAmount}>Amount</div>
            <div className={styles.inputAmount}>
              <span>Loop</span>
              <input
                autoFocus={true}
                style={
                  warning === "" ? { color: "lightgreen" } : { color: "red" }
                }
                min={0}
                type="number"
                defaultValue="0"
                onChange={(e) => setCountToken(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.warningContainer}>
            {warning ? (
              <div className={styles.warning}>
                <div>{warning}</div>
              </div>
            ) : null}
          </div>
          <div>
            {warning === "" ? (
              <div>
                <div className={styles.PriceContainer}>
                  <div className={styles.tokenPrice}>
                    <span className={styles.text}>Token Price</span>
                    <div>
                      <span className={styles.value}>{tokenPriceEth}</span>
                      <span className={styles.util}>ETH</span>
                    </div>
                  </div>
                  <div className={styles.tokenCount}>
                    <span className={styles.text}>Number Of Token</span>
                    <div>
                      <span className={styles.value}>{countToken}</span>
                      <span className={styles.util}>Loop</span>
                    </div>
                  </div>
                  <div className={styles.totalPrice}>
                    <span className={styles.text}>Total Price</span>
                    <div>
                      <span className={styles.value}>
                        {(
                          parseFloat(tokenPriceEth) * parseInt(countToken)
                        ).toFixed(4)}
                      </span>
                      <span className={styles.util}>ETH</span>
                    </div>
                  </div>
                </div>
                <div className={styles.buttonBuy}>
                  <div onClick={handelNextBtn}>Buy</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyLoopToken;
