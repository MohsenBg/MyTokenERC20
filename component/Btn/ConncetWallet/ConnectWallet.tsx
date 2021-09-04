import React, { useEffect, useState } from "react";
import styles from "./ConnectWallet.module.scss";
import Web3 from "web3";
import Error from "../../Error/Error";
import { useDispatch } from "react-redux";
import { ActionTypeError } from "../../../Redux/Error/ActionType";
import { ErrorTypes } from "../../Error/ErrorType/ErrorType";
import detectEthereumProvider from "@metamask/detect-provider";
import { ActionTypeAccountInfo } from "../../../Redux/AccountInfo/ActionType/ActionType";

const ConnectWallet = () => {
  const dispatch = useDispatch();
  //@ts-ignore

  const handelConnectWallet = async () => {
    const provider: any = await detectEthereumProvider();
    if (provider) {
      //Meta Mask installed
      await provider
        .request({ method: "eth_requestAccounts" })
        .then((accounts: any) =>
          dispatch({
            type: ActionTypeAccountInfo.ACCOUNT_ADDRESS,
            payload: accounts,
          })
        )
        .catch((error: any) => {
          if (error.code === 4001) {
            dispatch({
              type: ActionTypeError.ON_ERROR,
              title: "Meta Mask",
              text: "Please connect to MetaMask.",
              icon: "error",
              countBtn: 1,
              btn1: "ok",
              btn2: "",
              hidden: false,
              fontSize: "18px",
              zIndex: 10,
              ErrorType: ErrorTypes.META_MASK_CONNECTION_REJECTED,
            });
          }
          if (error.code === -32002) {
            dispatch({
              type: ActionTypeError.ON_ERROR,
              title: "Meta Mask",
              text: "request already sent to you ",
              icon: "error",
              countBtn: 1,
              btn1: "ok",
              btn2: "",
              hidden: false,
              fontSize: "18px",
              zIndex: 10,
              ErrorType: ErrorTypes.META_MASK_CONNECTION_REJECTED,
            });
          }
        });
    } else {
      //Meta Mask not install
      dispatch({
        type: ActionTypeError.ON_ERROR,
        title: "Meta Mask",
        text: " Install Meta Mask and refresh",
        icon: "error",
        countBtn: 1,
        btn1: "Install",
        btn2: "",
        hidden: false,
        fontSize: "18px",
        zIndex: 10,
        ErrorType: ErrorTypes.META_MASK_NOT_INSTALL,
      });
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <button className={styles.blob_btn} onClick={handelConnectWallet}>
          connect Wallet
          <span className={styles.blob_btn__inner}>
            <span className={styles.blob_btn__blobs}>
              <span className={styles.blob_btn__blob}></span>
              <span className={styles.blob_btn__blob}></span>
              <span className={styles.blob_btn__blob}></span>
              <span className={styles.blob_btn__blob}></span>
            </span>
          </span>
        </button>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              result="blur"
              stdDeviation="10"
            ></feGaussianBlur>
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7"
              result="goo"
            ></feColorMatrix>
            <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default ConnectWallet;
