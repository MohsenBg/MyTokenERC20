import React, { useEffect, useState } from "react";
import styles from "./WalletHead.module.scss";
import WalletImg from "../../public/assets/other/wallet.gif";
import EtherImg from "../../public/assets/other/Ethereum-Logo.wine.svg";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { initialState } from "../../Redux/store";
import Web3 from "web3";
import CopyToClipboard from "react-copy-to-clipboard";
import detectEthereumProvider from "@metamask/detect-provider";
import { ActionTypeAccountInfo } from "../../Redux/AccountInfo/ActionType/ActionType";
import { MdContentCopy } from "react-icons/md";
import { RiSendPlaneFill } from "react-icons/ri";
import { AiOutlineReload } from "react-icons/ai";

import Link from "next/link";
const WalletHead = () => {
  const dispatch = useDispatch();
  const AccountAddress = useSelector(
    (state: typeof initialState) => state.AccountData.addressAccounts
  );
  const [copy, setCopy] = useState(false);
  const [hover, setHover] = useState(false);
  const [utils, setUtils] = useState("wei");
  const [reload, setReload] = useState(false);
  const [accountBalance, setAccountBalance] = useState<any>(0);
  const Balance = useSelector(
    (state: typeof initialState) => state.AccountData.balance
  );
  useEffect(() => {
    convert(Balance);
  }, [AccountAddress, Balance]);
  const convert = async (value: any) => {
    let number = value;
    const provider: any = await detectEthereumProvider();
    if (provider) {
      if (AccountAddress.length >= 1) {
        const web3 = new Web3(provider);
        const balance = await web3.eth.getBalance(AccountAddress[0]);
        dispatch({
          type: ActionTypeAccountInfo.ACCOUNT_BALANCE,
          payload: balance,
        });
        if (value >= 1000000000000000) {
          const ether = web3.utils.fromWei(Balance, "ether");
          setUtils("ETH");
          number = ether;
        } else if (value < 1000000000000000 && value >= 1000000) {
          const gwei = web3.utils.fromWei(Balance, "Gwei");
          setUtils("GWEI");
          number = gwei;
        } else if (value < 1000000 && value >= 1000) {
          const Kwei = web3.utils.fromWei(Balance, "Kwei");
          setUtils("KWEI");
          number = Kwei;
        }
        if (typeof number === "string") {
          if (number.toString().length > 8) {
            number = number.substring(0, 8);
          }
        }
      }
      setAccountBalance(number.toString());
    }
  };
  const copied = () => {
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 3000);
  };

  //ReloadBalance
  const BalanceOfETH = async () => {
    setReload(true);
    const provider: any = await detectEthereumProvider();
    const web3: Web3 = new Web3(provider);
    if (provider) {
      if (AccountAddress.length >= 1) {
        const balance = await web3.eth.getBalance(AccountAddress[0]);
        if (balance !== Balance) {
          dispatch({
            type: ActionTypeAccountInfo.ACCOUNT_BALANCE,
            payload: balance,
          });
        }
      } else {
        dispatch({
          type: ActionTypeAccountInfo.ACCOUNT_BALANCE,
          payload: "",
        });
      }
    }
    setTimeout(() => {
      setReload(false);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titleWallet}>Wallet</h1>
      <div className={styles.content}>
        <div className={styles.MainBackground}>
          <div
            className={
              reload
                ? `${styles.reloadIcon}
          ${styles.reloadIconActive}`
                : `${styles.reloadIcon}`
            }
            onClick={BalanceOfETH}
          >
            <AiOutlineReload />
          </div>
          <div className={styles.walletImg}>
            <div>
              <Image
                src={WalletImg}
                alt="Wallet"
                height="120px"
                width="150px"
              />
            </div>
          </div>
          <CopyToClipboard text={AccountAddress} onCopy={copied}>
            <div
              className={styles.address}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              {AccountAddress.length >= 1 ? (
                <div className={styles.addressContainer}>
                  <div className={styles.addressData}>
                    <div>
                      {AccountAddress[0].substring(0, 5)}...
                      {AccountAddress[0].substring(
                        AccountAddress[0].length - 4
                      )}
                    </div>
                    <div className={styles.copyIcon}>
                      <MdContentCopy />
                    </div>
                  </div>
                  <div>
                    {hover ? (
                      <div className={styles.copyMassage}>
                        {copy ? "Copied!" : "Copy to clipboard"}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </CopyToClipboard>
          <div className={styles.etherImg}>
            <Image src={EtherImg} alt="Wallet" height="60px" width="60px" />
          </div>
          <div>
            {Balance === "" || Balance === undefined ? (
              "connection failed pleas refresh page and try again"
            ) : (
              <div className={styles.balanceData}>
                <div className={styles.balance}>
                  {typeof accountBalance === "string" ||
                  typeof accountBalance === "number"
                    ? accountBalance
                    : null}
                </div>
                <div className={styles.utils}>{utils}</div>
              </div>
            )}
          </div>
          <Link href="/transaction/ETH">
            <div className={styles.button}>
              <div className={styles.btnText}>Send</div>
              <div className={styles.icon}>
                <RiSendPlaneFill />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WalletHead;
