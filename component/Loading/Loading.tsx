import React from "react";
import { useSelector } from "react-redux";
import LoadingSvg from "../../public/assets/other/Double Ring.svg";
import { initialState } from "../../Redux/store";
import styles from "./Loading.module.scss";
import Image from "next/dist/client/image";
const Loading = () => {
  const loading = useSelector(
    (state: typeof initialState) => state.Loading.Loading
  );
  return (
    <>
      {loading ? (
        <div className={styles.Container}>
          <div className={styles.loading}>
            <Image src={LoadingSvg} alt="LoadingSvg" />
          </div>
          <h1>Loading</h1>
        </div>
      ) : null}
    </>
  );
};

export default Loading;
