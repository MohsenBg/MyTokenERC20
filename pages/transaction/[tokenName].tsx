import React from "react";
import { useRouter } from "next/router";
import styles from "../../styles/TokenName.module.scss";
import SendTokenComponent from "../../component/SendToken/SendToken";
import Head from "next/head";

const SendTokens = () => {
  const router = useRouter();
  const { tokenName } = router.query;
  return (
    <>
      <Head>
        <title>Send {tokenName}</title>
        <meta name="SendToken" content="SendToken" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <div>
          <SendTokenComponent params={tokenName} />
        </div>
      </div>
    </>
  );
};

export default SendTokens;
