import React from "react";
import SendETH from "../../component/SendETH/SendETH";
import Head from "next/head";

const ETH = () => {
  return (
    <div>
      <Head>
        <title>Send Ethereum</title>
        <meta name="Send Ethereum" content="Send Ethereum" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <SendETH />
      </div>
    </div>
  );
};

export default ETH;
