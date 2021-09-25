import { useRouter } from "next/router";
import React, { useState } from "react";
import EditProduct from "../../../component/EditProduct/EditProduct";
import Head from "next/head";
import { ActionTypeLoading } from "../../../Redux/Loading/Actions";
import { useDispatch } from "react-redux";
const Edit = () => {
  const router = useRouter();
  const [render, setRender] = useState(false);
  const { id } = router.query;
  const dispatch = useDispatch();
  if (!render) {
    dispatch({
      type: ActionTypeLoading.ON_LOADING,
    });
  }
  setTimeout(() => {
    setRender(true);
  }, 2000);
  return (
    <div>
      <Head>
        <title>Edit Product</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="Edit Product" content="Edit Product.." />
      </Head>
      <div>
        {render ? (
          <div>
            <EditProduct Id={id} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default Edit;
