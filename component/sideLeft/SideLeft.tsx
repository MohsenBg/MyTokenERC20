import React, { useState } from "react";
import Link from "next/link";
import styles from "./SideLeft.module.scss";
import { navItem } from "./NavItem";
import { HiOutlineMenuAlt1, HiOutlineMenuAlt2 } from "react-icons/hi";

const SideLeft = () => {
  const [menuStatus, setMenuStatus] = useState<any>("none");

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
                <Link key={item.id} href={item.link}>
                  <div
                    className={styles.navCard}
                    onClick={() => setMenuStatus("close")}
                  >
                    <div className={styles.iconNav}>
                      <item.icon />
                    </div>
                    <div className={styles.nameNav}>
                      <span>{item.name}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideLeft;
