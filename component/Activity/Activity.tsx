import React, { useEffect, useState } from "react";
import styles from "./Activity.module.scss";
import signal from "../../public/assets/other/halloween-wood-empty-signal.png";
import {
  ABI_LOOP_TOKEN_CONTRACT,
  ABI_SELL_CONTRACT,
  ADDRESS_LOOP_TOKEN,
  ADDRESS_SELL_TOKEN,
} from "../../config_Contracts";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { useSelector } from "react-redux";
import { initialState } from "../../Redux/store";
import { BsArrowRepeat, BsArrowUpRight } from "react-icons/bs";
import { MdCallReceived } from "react-icons/md";
import SmallLoading from "../Loading/SmallLoading";
import Image from "next/image";
import Transaction from "../Transaction/Transaction";
const Activity = () => {
  const [loading, setLoading] = useState(false);
  const [transactionHas, setTransactionHas] = useState<any>("");
  const currentAccount = useSelector(
    (state: typeof initialState) => state.AccountData.addressAccounts
  );
  const [historyLoop, setHistoryLoop] = useState<any>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    transActionsHistory();
  }, [currentAccount]);

  const transActionsHistory = async () => {
    setLoading(true);
    const Provider: any = await detectEthereumProvider();
    const web3 = new Web3(Provider);
    const ContractLoopToken = new web3.eth.Contract(
      //@ts-ignore
      ABI_LOOP_TOKEN_CONTRACT,
      ADDRESS_LOOP_TOKEN
    );
    const ContractSale = new web3.eth.Contract(
      //@ts-ignore
      ABI_SELL_CONTRACT,
      ADDRESS_SELL_TOKEN
    );
    let SellLoopEvent: any = [];
    await ContractSale.getPastEvents(
      "Sell",
      {
        fromBlock: 0,
        toBlock: "latest",
        filter: { _buyer: currentAccount[0] },
      },
      (error: any, result: any) => {
        if (result) {
          for (let i = 0; i < result.length; i++) {
            let Objects = {
              id: result[i].transactionHash,
              from: ADDRESS_SELL_TOKEN,
              to: result[i].returnValues._buyer,
              amount: `+${result[i].returnValues._amount}`,
              blockNumber: result[i].blockNumber,
              status: "Buy Loop Token",
            };
            SellLoopEvent.push(Objects);
          }
        }
        if (error) {
          console.log(error);
        }
      }
    );

    let TransferLoopEventSend: any = [];

    await ContractLoopToken.getPastEvents(
      "Transfer",
      {
        fromBlock: 0,
        toBlock: "latest",
        filter: { _from: currentAccount[0] },
      },
      (error: any, result: any) => {
        if (result) {
          for (let i = 0; i < result.length; i++) {
            let Objects = {
              id: result[i].transactionHash,
              to: result[i].returnValues._to,
              from: result[i].returnValues._from,
              amount: `-${result[i].returnValues._value}`,
              blockNumber: result[i].blockNumber,
              status: "Send",
            };
            TransferLoopEventSend.push(Objects);
          }
        }
      }
    );

    let TransferLoopEventReceive: any = [];
    await ContractLoopToken.getPastEvents(
      "Transfer",
      {
        fromBlock: 0,
        toBlock: "latest",
        filter: { _to: currentAccount[0] },
      },
      (error: any, result: any) => {
        if (result) {
          for (let i = 0; i < result.length; i++) {
            if (
              result[i].returnValues._from.toLowerCase() !==
              ADDRESS_SELL_TOKEN.toLowerCase()
            ) {
              let Objects = {
                id: result[i].transactionHash,
                to: result[i].returnValues._to,
                from: result[i].returnValues._from,
                amount: `+${result[i].returnValues._value}`,
                blockNumber: result[i].blockNumber,
                status: "Receive",
              };
              TransferLoopEventReceive.push(Objects);
            }
          }
        }
      }
    );

    let merge = await SellLoopEvent.concat(TransferLoopEventSend);
    merge = await merge.concat(TransferLoopEventReceive);
    const SortByBlockNumber = await merge.sort(function (a: any, b: any) {
      return a.blockNumber - b.blockNumber;
    });
    const result = SortByBlockNumber.reverse();
    if (historyLoop !== result) {
      setHistoryLoop(result);
    }
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Activity</h1>
      <div
        className={
          loading ? `${styles.cards} ${styles.cardsRenders}` : `${styles.cards}`
        }
      >
        {loading ? (
          <div className={styles.loading}>
            <SmallLoading />
            <h4>Loading data</h4>
          </div>
        ) : null}
        {historyLoop.length >= 1 ? (
          <div>
            {historyLoop.map((item: any) => {
              return (
                <div
                  key={item.id}
                  className={styles.card}
                  onClick={() => {
                    setTransactionHas({
                      has: item.id,
                      amount: item.amount,
                      status: item.status,
                    });
                    setOpen(true);
                  }}
                >
                  <div className={styles.left}>
                    {item.status === "Receive" ? (
                      <div className={styles.arrowIcon}>
                        <MdCallReceived />
                      </div>
                    ) : item.status === "Send" ? (
                      <div className={styles.arrowIcon}>
                        <BsArrowUpRight />
                      </div>
                    ) : (
                      <div className={styles.arrowIcon}>
                        <BsArrowRepeat />
                      </div>
                    )}
                    <div>
                      <div className={styles.titleCards}>
                        <div>{item.status}</div>
                      </div>
                      <div>
                        {item.status === "Send" ? (
                          <div
                            className={styles.address}
                          >{`to: ${item.to.substring(
                            0,
                            5
                          )}... ${item.from.substring(
                            item.to.length - 4
                          )}`}</div>
                        ) : (
                          <div
                            className={styles.address}
                          >{`from: ${item.from.substring(
                            0,
                            5
                          )}...${item.from.substring(
                            item.from.length - 4
                          )}`}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.right}>
                    <div>{item.amount}</div>
                    <span>Loop</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.NoActivity}>
            <Image src={signal} height="300px" width="300px" />
            <div className={styles.text}>No Activity recorded</div>
          </div>
        )}
      </div>
      {transactionHas !== "" && open ? (
        <div className={styles.Transaction}>
          <Transaction
            TransactionHas={transactionHas}
            close={() => setOpen(false)}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Activity;
