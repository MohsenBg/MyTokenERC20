import React, { useState } from "react";
import styles from "./Accounts.module.scss";
import AccountImg from "../../public/assets/other/AccountImg.gif";
import Image from "next/image";
import { initialState } from "../../Redux/store";
import { useSelector } from "react-redux";
import PanelAccount from "../PanelAccount/PanelAccount";

const Accounts = () => {
  const [hover, setHover] = useState("none");
  const AccountAddress = useSelector(
    (state: typeof initialState) => state.AccountData.addressAccounts
  );
  const [statusPanel, setStatusPanel] = useState(false);
  return (
    <div className={styles.container}>
      <div
        onMouseEnter={() => setHover("hover")}
        onMouseLeave={() => setHover("notHover")}
        className={styles.AccountData}
        onClick={() => setStatusPanel(!statusPanel)}
      >
        <div className={styles.addressAccount}>
          {AccountAddress[0].substring(0, 5)}...
          {AccountAddress[0].substring(AccountAddress[0].length - 4)}
        </div>
        <div
          className={
            hover === "hover"
              ? `${styles.AccountImg} ${styles.AccountImgHover}`
              : hover === "notHover"
              ? `${styles.AccountImg} ${styles.AccountImgNotHover}`
              : `${styles.AccountImg}`
          }
        >
          <Image src={AccountImg} alt="AccountImg" width="80px" height="80px" />
        </div>
      </div>
      <div>
        {statusPanel ? (
          <div className={styles.PanelAccount}>
            <PanelAccount />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Accounts;
