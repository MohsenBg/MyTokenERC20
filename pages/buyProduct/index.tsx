import React from "react";
import BuyProduct from "../../component/BuyProduct/BuyProduct";
import Head from "next/head";
const Product = () => {
  return (
    <div>
      <Head>
        <title>Buy product</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="Buy product" content="Buy product page ..." />
      </Head>
      <div>
        <BuyProduct />
      </div>
    </div>
  );
};

export default Product;
