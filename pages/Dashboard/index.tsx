import React, { useState } from "react";
import styles from "../../styles/Dashboard.module.scss";
import DashboardHead from "../../component/DashboardHead/DashboardHead";
import AddProduct from "../../component/AddProduct/AddProduct";
import MyProduct from "../../component/MyProduct/MyProduct";
import Head from "next/head";
const Dashboard = () => {
  const [status, setStatus] = useState("My Product");

  const changeStatus = (value: any) => {
    if (value === "My Product") {
      setStatus("My Product");
    }
    if (value === "Add Product") {
      setStatus("Add Product");
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="Dashboard" content="Dashboard ..." />
      </Head>
      <div className={styles.container}>
        <div>
          <DashboardHead getStatus={(e: any) => changeStatus(e)} />
        </div>
        <div>
          {status === "My Product" ? (
            <div>
              <MyProduct />
            </div>
          ) : status === "Add Product" ? (
            <div>
              <AddProduct />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
