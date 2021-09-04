import Image from "next/image";
import React from "react";
import { TokenList, TokenItem } from "./TokenItems";
import styles from "./Token.module.scss";
import { initialState } from "../../Redux/store";
import { useSelector } from "react-redux";
import Link from "next/link";
const Token = () => {
  const LoopTokenBalance = useSelector(
    (state: typeof initialState) => state.LoopToken.balance
  );

  const tokensBalance = (TokenName: any) => {
    switch (TokenName) {
      case "Loop Token":
        return LoopTokenBalance;
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tokens</h1>
      <div className={styles.content}>
        <div className={styles.cards}>
          {TokenList.map((token: TokenItem) => {
            return (
              <div className={styles.card} key={token.id}>
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
                      <span> USD : none</span>
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
                  {token.buyAble ? <div>Buy</div> : null}
                  <Link href={`/transaction/${token.Name}`}>
                    <div>Send</div>
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
