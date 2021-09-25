import React from "react";
import ConnectWallet from "../Btn/ConncetWallet/ConnectWallet";
import styles from "./NavBar.module.scss";
import { useSelector } from "react-redux";
import { initialState } from "../../Redux/store";
import Accounts from "../Accounts/Accounts";
import SideLeft from "../sideLeft/SideLeft";
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
            <>
              <div className={styles.Accounts}>
                <Accounts />
              </div>
            </>
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
