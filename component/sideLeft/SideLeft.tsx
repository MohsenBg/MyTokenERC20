import React, { useState } from "react";
import Link from "next/link";
import styles from "./SideLeft.module.scss";
import { navItem } from "./NavItem";
import { HiOutlineMenuAlt1, HiOutlineMenuAlt2 } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { initialState } from "../../Redux/store";
import { useRouter } from "next/router";
import { ActionTypeError } from "../../Redux/Error/ActionType";
import { ErrorTypes } from "../Error/ErrorType/ErrorType";

const SideLeft = () => {
  const [menuStatus, setMenuStatus] = useState<any>("none");
  const currentAccount = useSelector(
    (state: typeof initialState) => state.AccountData.addressAccounts
  );
  const menuHandler = () => {
    if (menuStatus === "none") {
      setMenuStatus("open");
    }
    if (menuStatus === "open") {
      setMenuStatus("close");
    }
    if (menuStatus === "close") {
      setMenuStatus("open");
    }
  };
  const dispatch = useDispatch();
  const router = useRouter();

  const handelRouter = (path: any) => {
    setMenuStatus("close");
    if (currentAccount.length >= 1) {
      router.push(`${path}`, undefined, { shallow: false });
    } else {
      dispatch({
        type: ActionTypeError.ON_ERROR,
        title: "Permission",
        text: "Please connect to your Account First.",
        icon: "error",
        countBtn: 1,
        btn1: "ok",
        btn2: "",
        hidden: false,
        fontSize: "18px",
        zIndex: 10,
        ErrorType: ErrorTypes.CONNECT_YOUR_ACCOUNT,
      });
    }
  };

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.navbarContactBox}>
          <div className={styles.menuIcon} onClick={menuHandler}>
            <HiOutlineMenuAlt1 />
          </div>
        </div>
        <div
          className={
            menuStatus === "none"
              ? `${styles.boxContainerNav}`
              : menuStatus === "close"
              ? `${styles.boxContainerNav} ${styles.boxDiActive}`
              : menuStatus === "open"
              ? `${styles.boxContainerNav} ${styles.boxActive}`
              : `${styles.boxContainerNav}`
          }
        >
          <div className={styles.menuIcon} onClick={menuHandler}>
            <HiOutlineMenuAlt1 />
          </div>
          <div className={styles.NavCardContainer}>
            {navItem.map((item: any) => {
              return (
                <div
                  key={item.id}
                  className={styles.navCard}
                  onClick={() => handelRouter(item.link)}
                >
                  <div className={styles.iconNav}>
                    <item.icon />
                  </div>
                  <div className={styles.nameNav}>
                    <span>{item.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideLeft;
