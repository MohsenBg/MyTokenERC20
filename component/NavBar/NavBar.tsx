import React, { useEffect } from "react";
import ConnectWallet from "../Btn/ConncetWallet/ConnectWallet";
import styles from "./NavBar.module.scss";
import detectEthereumProvider from "@metamask/detect-provider";
import { useDispatch, useSelector } from "react-redux";
import { ActionTypeAccountInfo } from "../../Redux/AccountInfo/ActionType/ActionType";
import { initialState } from "../../Redux/store";
import Accounts from "../Accounts/Accounts";
import Image from "next/image";
import LogoImg from "../../public/assets/other/favicon.png";
import { BiMenu, BiMenuAltLeft } from "react-icons/bi";
import SideLeft from "../sideLeft/SideLeft";
import Web3 from "web3";
const NavBar = () => {
  const accounts = useSelector(
    (state: typeof initialState) => state.AccountData.addressAccounts
  );
  return (
    <div className={styles.containerNav}>
      <div className={styles.mainContentNav}>
        <div className={styles.NavBar}>
          <div className={styles.sideLeft}>
            <SideLeft />
          </div>

          {accounts.length >= 1 ? (
            <div className={styles.Accounts}>
              <Accounts />
            </div>
          ) : (
            <div className={styles.btnConnectWallet}>
              <ConnectWallet />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;

/* <div className={styles.logo}>
            <span className={styles.logoText}>LoopToken</span>
            <div className={styles.logoImg}>
              <Image src={LogoImg} width="55px" height="55px" />
            </div>
          </div> */
