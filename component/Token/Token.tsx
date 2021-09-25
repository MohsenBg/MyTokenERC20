import Image from "next/image";
import React, { useState } from "react";
import { TokenList, TokenItem } from "./TokenItems";
import styles from "./Token.module.scss";
import { initialState } from "../../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import {
  ABI_LOOP_TOKEN_CONTRACT,
  ABI_SELL_CONTRACT,
  ADDRESS_LOOP_TOKEN,
  ADDRESS_SELL_TOKEN,
} from "../../config_Contracts";
import Web3 from "web3";
import { ActionTypeLoopToken } from "../../Redux/LoopToken/ActionType";
import detectEthereumProvider from "@metamask/detect-provider";
import { AiOutlineReload } from "react-icons/ai";
const Token = () => {
  const LoopTokenBalance = useSelector(
    (state: typeof initialState) => state.LoopToken.balance
  );
  const [reload, setReload] = useState(false);
  const dispatch = useDispatch();

  const tokensBalance = (TokenName: any) => {
    switch (TokenName) {
      case "Loop Token":
        return LoopTokenBalance;
        break;
      default:
        break;
    }
  };
  const currentAccount = useSelector(
    (state: typeof initialState) => state.AccountData.addressAccounts
  );

  const Usd = useSelector(
    (state: typeof initialState) => state.ContractSale.Usd
  );

  const BalanceOfLoopToken = async () => {
    setReload(true);
    const provider: any = await detectEthereumProvider();
    const web3: Web3 = new Web3(provider);
    if (provider) {
      if (currentAccount.length >= 1) {
        const Contract = await new web3.eth.Contract(
          //@ts-ignore
          ABI_LOOP_TOKEN_CONTRACT,
          ADDRESS_LOOP_TOKEN
        );
        const Balance = await Contract.methods
          .balanceOf(currentAccount[0])
          .call();
        if (LoopTokenBalance !== Balance) {
          dispatch({
            type: ActionTypeLoopToken.BALANCE,
            balance: Balance,
          });
        }
      } else {
        dispatch({
          type: ActionTypeLoopToken.BALANCE,
          balance: 0,
        });
      }
    }
    setTimeout(() => {
      setReload(false);
    }, 1000);
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tokens</h1>
      <div className={styles.content}>
        <div className={styles.cards}>
          {TokenList.map((token: TokenItem) => {
            return (
              <div className={styles.card} key={token.id}>
                <div
                  onClick={BalanceOfLoopToken}
                  className={
                    reload
                      ? `${styles.reloadIcon}
          ${styles.reloadIconActive}`
                      : `${styles.reloadIcon}`
                  }
                >
                  <AiOutlineReload />
                </div>
                <div className={styles.mainContent}>
                  <div className={styles.TokenImg}>
                    <Image
                      src={token.Img}
                      alt="TokenImg"
                      width="60px"
                      height="60px"
                    />
                  </div>
                  <div className={styles.titleCard}>
                    <h1>{token.Name}</h1>
                    <div className={styles.usd}>
                      <div>
                        <span className={styles.unit}>USD :</span>
                        <span className={styles.number}>
                          {(
                            (parseFloat(Usd.toString().slice(0, -6)) / 100) *
                            tokensBalance(token.Name)
                          ).toLocaleString("en-US")}
                        </span>
                        <span className={styles.dolorIcon}>$</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.balanceData}>
                    <div className={styles.balanceText}>Balance</div>
                    <div className={styles.balanceNumber}>
                      {LoopTokenBalance ? (
                        <div>{tokensBalance(token.Name)}</div>
                      ) : (
                        "0"
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.buttons}>
                  {token.buyAble ? (
                    <Link href="/buyToken">
                      <div>Buy</div>
                    </Link>
                  ) : null}
                  <Link href={`/transaction/${token.Name}`}>
                    <div>Send</div>
                  </Link>
                  <Link href={`/Approval/${token.Name}`}>
                    <div>Approve</div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Token;
