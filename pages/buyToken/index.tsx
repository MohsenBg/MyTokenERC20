import Head from "next/head";
import React from "react";
import { useDispatch } from "react-redux";
import BuyLoopToken from "../../component/BuyToken/BuyLoopToken";
import { ActionTypeLoading } from "../../Redux/Loading/Actions";
interface Props {}
const BuyToken: React.FunctionComponent<Props> = () => {
  const dispatch = useDispatch();
  dispatch({
    type: ActionTypeLoading.ON_LOADING,
  });
  setTimeout(() => {
    dispatch({
      type: ActionTypeLoading.END_LOADING,
    });
  }, 2000);
  return (
    <div>
      <Head>
        <title>Buy Token</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <BuyLoopToken />
      </div>
    </div>
  );
};

export default BuyToken;
