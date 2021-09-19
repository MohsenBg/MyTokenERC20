import Head from "next/head";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Wallet.module.scss";
import WalletHead from "../../component/Wallet/WalletHead";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { useDispatch, useSelector } from "react-redux";
import { initialState } from "../../Redux/store";
import { ActionTypeAccountInfo } from "../../Redux/AccountInfo/ActionType/ActionType";
import Token from "../../component/Token/Token";
import TransActions from "../../component/Activity/Activity";
const Wallet = () => {
  const AccountAddress = useSelector(
    (state: typeof initialState) => state.AccountData.addressAccounts
  );

  const [navigation, setNavigation] = useState("Assets");

  const dispatch = useDispatch();

  useEffect(() => {
    const getBalance = async () => {
      const provider: any = await detectEthereumProvider();
      if (provider) {
        const web3 = new Web3(provider);
        if (AccountAddress.length >= 1) {
          const Balance = await web3.eth.getBalance(AccountAddress[0]);
          dispatch({
            type: ActionTypeAccountInfo.ACCOUNT_BALANCE,
            payload: Balance,
          });
        }
      }
    };
    getBalance();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Wallet</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="Wallet" content="Wallet page see transAction and ..." />
      </Head>
      <div className={styles.WalletHead}>
        <WalletHead />
        <div className={styles.buttons}>
          <div className={styles.btn} onClick={() => setNavigation("Assets")}>
            Assets
          </div>
          <div className={styles.btn} onClick={() => setNavigation("Activity")}>
            Activity
          </div>
        </div>
      </div>
      {navigation === "Assets" ? (
        <div className={styles.Token}>
          <Token />
        </div>
      ) : navigation === "Activity" ? (
        <div>
          <TransActions />
        </div>
      ) : null}
    </div>
  );
};

export default Wallet;
