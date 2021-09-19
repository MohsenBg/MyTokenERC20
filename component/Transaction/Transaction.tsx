import React, { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import styles from "./Transaction.module.scss";
import { IoMdClose } from "react-icons/io";
import SmallLoading from "../Loading/SmallLoading";
import { FaLongArrowAltRight } from "react-icons/fa";
const Transaction = ({ TransactionHas, close }: any) => {
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState<any>({});

  useEffect(() => {
    const getTransactionHas = async () => {
      setLoading(true);
      const Provider: any = await detectEthereumProvider();
      const web3 = new Web3(Provider);
      const transaction = await web3.eth.getTransaction(TransactionHas.has);
      const gasUsed = (await web3.eth.getTransactionReceipt(TransactionHas.has))
        .gasUsed;
      let total = web3.utils.fromWei(
        `${gasUsed * parseInt(transaction.gasPrice)}`,
        "ether"
      );
      let gasPrice = web3.utils.fromWei(transaction.gasPrice, "Gwei");
      let data = {
        Has: transaction.hash,
        status: TransactionHas.status,
        From: transaction.from,
        To: transaction.to,
        Nonce: transaction.nonce,
        Amount: TransactionHas.amount,
        GasLimit: transaction.gas,
        GasUsed: gasUsed,
        GasPrice: gasPrice,
        Total: total.substring(0, 8),
      };
      setTransactionData(data);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };
    getTransactionHas();
  }, [TransactionHas]);

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div
            className={styles.IconClose}
            onClick={() => {
              close();
            }}
          >
            <IoMdClose />
          </div>
          {loading ? (
            <div className={styles.loading}>
              <SmallLoading />
            </div>
          ) : (
            <>
              {typeof transactionData.Has !== undefined &&
              typeof transactionData.From === "string" ? (
                <>
                  <div className={styles.title}>
                    <h1>{transactionData.status}</h1>
                  </div>
                  <div className={styles.details}>
                    <h4>Details</h4>
                  </div>
                  <div className={styles.addressContainer}>
                    <div className={styles.address}>
                      <span className={styles.text}>From: </span>
                      <div>{transactionData.From.substring(0, 15)}...</div>
                    </div>
                    <div className={styles.arrow}>
                      <FaLongArrowAltRight />
                    </div>
                    <div className={styles.address}>
                      <span className={styles.text}>To: </span>
                      <div>{transactionData.To.substring(0, 15)}...</div>
                    </div>
                  </div>
                  <div className={styles.transactionContainer}>
                    <div className={styles.transaction}>Transaction</div>
                    <div className={styles.transactionData}>
                      <div className={styles.data}>Nonce</div>
                      <div className={styles.result}>
                        {transactionData.Nonce}
                      </div>
                    </div>
                    <div className={styles.transactionData}>
                      <div className={styles.data}>Amount</div>
                      <div className={styles.result}>
                        {transactionData.Amount} Loop
                      </div>
                    </div>
                    <div className={styles.transactionData}>
                      <div className={styles.data}>GasLimit(Units)</div>
                      <div className={styles.result}>
                        {transactionData.GasLimit}
                      </div>
                    </div>
                    <div className={styles.transactionData}>
                      <div className={styles.data}>GasUsed(Units)</div>
                      <div className={styles.result}>
                        {transactionData.GasUsed}
                      </div>
                    </div>
                    <div className={styles.transactionData}>
                      <div className={styles.data}>GasPrice</div>
                      <div className={styles.result}>
                        {transactionData.GasPrice}
                      </div>
                    </div>
                    <div className={styles.transactionData}>
                      <div className={styles.data}>Total</div>
                      <div className={styles.result}>
                        {transactionData.Total} ETH
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transaction;
