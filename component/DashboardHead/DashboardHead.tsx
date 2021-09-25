import React, { useState } from "react";
import styles from "./DashboardHead.module.scss";
const DashboardHead = ({ getStatus }: any) => {
  const [select, setSelect] = useState("My Product");
  const status = (status: any) => {
    setSelect(status);
    getStatus(status);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div
          className={styles.options}
          style={
            select === "My Product" ? { backgroundColor: "rgb(62,31,62)" } : {}
          }
          onClick={() => status("My Product")}
        >
          My Product
        </div>
        <div
          className={styles.options}
          style={
            select === "Add Product" ? { backgroundColor: "rgb(62,31,62)" } : {}
          }
          onClick={() => status("Add Product")}
        >
          Add Product
        </div>
      </div>
    </div>
  );
};

export default DashboardHead;
