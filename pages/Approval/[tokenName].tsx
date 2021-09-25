import { useRouter } from "next/router";
import React from "react";
import Approve from "../../component/approve/Approve";
import Head from "next/head";
const Approval = () => {
  const router = useRouter();
  const { tokenName } = router.query;
  return (
    <div>
      <Head>
        <title>Approve</title>
        <meta name="Approve" content="Approve" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Approve params={tokenName} />
      </div>
    </div>
  );
};

export default Approval;
