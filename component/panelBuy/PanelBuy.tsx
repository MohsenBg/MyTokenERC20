import React, { useEffect, useState } from "react";
import styles from "./PanelBuy.module.scss";
import {
  ABI_LOOP_TOKEN_CONTRACT,
  ABI_PRODUCTS,
  ADDRESS_LOOP_TOKEN,
  ADDRESS_PRODUCTS,
} from "../../config_Contracts";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { IoIosCloseCircle } from "react-icons/io";
import { initialState } from "../../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import SmallLoading from "../Loading/SmallLoading";
import Link from "next/link";
import { ErrorTypes } from "../Error/ErrorType/ErrorType";
import { ActionTypeError } from "../../Redux/Error/ActionType";
import { useRouter } from "next/router";
const PanelBuy = ({ id, Close }: any) => {
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>({});
  const getProduct = async () => {
    setLoading(true);
    const provider: any = await detectEthereumProvider();
    if (provider) {
      const web3 = new Web3(provider);
      const ProductContract = new web3.eth.Contract(
        //@ts-ignore
        ABI_PRODUCTS,
        ADDRESS_PRODUCTS
      );
      const product = await ProductContract.methods.items(id).call();
      let data = {
        id: product.Id,
        imgUrl: product.ImgUrl,
        owner: product.Owner,
        price: product.Price,
        productName: product.ProductName,
        sellAble: product.SellAble,
        description: product.descriptors,
      };
      setProductData(data);
      handelWarning();
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  const dispatch = useDispatch();
  const router = useRouter();

  const currentAccount = useSelector(
    (state: typeof initialState) => state.AccountData.addressAccounts
  );
  const approval = useSelector(
    (state: typeof initialState) => state.AccountData.approval
  );
  const balance = useSelector(
    (state: typeof initialState) => state.LoopToken.balance
  );

  const handelWarning = () => {
    let Approval = parseInt(approval);
    let Balance = parseInt(balance);
    let price = parseInt(productData.price);

    if (Balance >= price) {
      if (Approval >= price) {
        setWarning("");
      } else {
        setWarning("lackApproval");
      }
    } else {
      setWarning("lackBalance");
    }
  };

  useEffect(() => {
    getProduct();
  }, [id, currentAccount, balance, approval, productData.price]);

  const handelApprove = async () => {
    const provider: any = await detectEthereumProvider();
    const web3 = new Web3(provider);
    if (provider) {
      const ContractLoopToken = await new web3.eth.Contract(
        //@ts-ignore
        ABI_LOOP_TOKEN_CONTRACT,
        ADDRESS_LOOP_TOKEN
      );
      if (currentAccount.length >= 1) {
        try {
          await ContractLoopToken.methods
            .approve(ADDRESS_PRODUCTS, productData.price)
            .send({ from: currentAccount[0] })
            .once("receipt", (receipt: any) => {});
        } catch (error: any) {
          if (error.code === 4001) {
            dispatch({
              type: ActionTypeError.ON_ERROR,
              title: "Meta Mask",
              text: "Denied transaction signature",
              icon: "error",
              countBtn: 1,
              btn1: "ok",
              btn2: "",
              hidden: false,
              fontSize: "18px",
              zIndex: 10,
              ErrorType: ErrorTypes.META_MASK_USER_DENIED_TRANSACTION,
            });
          }
        }
      }
    }
  };
  const handelBuyProduct = async () => {
    const provider: any = await detectEthereumProvider();
    const web3 = new Web3(provider);
    if (provider) {
      const ContractProduct = await new web3.eth.Contract(
        //@ts-ignore
        ABI_PRODUCTS,
        ADDRESS_PRODUCTS
      );
      if (currentAccount.length >= 1) {
        try {
          await ContractProduct.methods
            .BuyProduct(id)
            .send({ from: currentAccount[0] })
            .once("receipt", (receipt: any) => {
              router.push("/Dashboard", undefined, { shallow: false });
            });
        } catch (error: any) {
          if (error.code === 4001) {
            dispatch({
              type: ActionTypeError.ON_ERROR,
              title: "Meta Mask",
              text: "Denied transaction signature",
              icon: "error",
              countBtn: 1,
              btn1: "ok",
              btn2: "",
              hidden: false,
              fontSize: "18px",
              zIndex: 10,
              ErrorType: ErrorTypes.META_MASK_USER_DENIED_TRANSACTION,
            });
          }
        }
      }
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <div className={styles.IconClose} onClick={Close}>
          <IoIosCloseCircle />
        </div>
        {loading ? (
          <div className={styles.loading}>
            <SmallLoading />
          </div>
        ) : (
          <>
            <h1 className={styles.title}>Buy Product</h1>
            <div className={styles.balanceContainer}>
              <h3>your balance</h3>
              <div className={styles.balance}>
                <div className={styles.left}>Balance</div>
                <div className={styles.right}>
                  <span className={styles.number}>{balance}</span>
                  <span className={styles.uint}>Loop</span>
                </div>
              </div>
              <div className={styles.balance}>
                <div className={styles.left}>Approval</div>
                <div className={styles.right}>
                  <span className={styles.number}> {approval}</span>
                  <span className={styles.uint}>Loop</span>
                </div>
              </div>
            </div>
            <div className={styles.balanceContainer}>
              <h3>Product</h3>
              <div className={styles.balance}>
                <div className={styles.left}>Price</div>
                <div className={styles.right}>
                  <span className={styles.number}>{productData.price}</span>
                  <span className={styles.uint}> Loop</span>
                </div>
              </div>
            </div>
            {warning === "lackBalance" ? (
              <div className={styles.footerContainer}>
                <span className={styles.text} style={{ color: "red" }}>
                  your balance not enough
                </span>
                <Link href="/buyToken">
                  <div className={styles.btn}>Buy Token</div>
                </Link>
              </div>
            ) : warning === "lackApproval" ? (
              <div className={styles.footerContainer}>
                <span
                  className={styles.text}
                  style={{ color: "red", fontSize: "12px" }}
                >
                  you should Approve for spend {productData.price} Loop
                </span>

                <div className={styles.btn} onClick={handelApprove}>
                  Approve
                </div>
              </div>
            ) : (
              <div className={styles.footerContainer}>
                <span className={styles.text} style={{ color: "lightgreen" }}>
                  you can Buy Product
                </span>

                <div className={styles.btn} onClick={handelBuyProduct}>
                  Buy Product
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PanelBuy;
