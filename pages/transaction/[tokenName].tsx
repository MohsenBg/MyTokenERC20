import React from "react";
import { useRouter } from "next/router";
import styles from "../../styles/TokenName.module.scss";
import SendTokenComponent from "../../component/SendToken/SendToken";
const SendTokens = () => {
  const router = useRouter();
  const { tokenName } = router.query;
  return (
    <div className={styles.container}>
      <div>
        <SendTokenComponent params={tokenName} />
      </div>
    </div>
  );
};

export default SendTokens;
