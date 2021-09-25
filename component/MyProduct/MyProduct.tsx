import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ABI_PRODUCTS, ADDRESS_PRODUCTS } from "../../config_Contracts";
import Link from "next/link";
import detectEthereumProvider from "@metamask/detect-provider";
import { initialState } from "../../Redux/store";
import Web3 from "web3";
import Image from "next/image";
import styles from "./MyProduct.module.scss";
import { AiFillCopy } from "react-icons/ai";
import CopyToClipboard from "react-copy-to-clipboard";
import { ActionTypeError } from "../../Redux/Error/ActionType";
import { ErrorTypes } from "../Error/ErrorType/ErrorType";
import Basket from "../../public/assets/other/139-basket-outline.gif";
import SmallLoading from "../Loading/SmallLoading";
const MyProduct = () => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>([]);
  const currentAccount = useSelector(
    (state: typeof initialState) => state.AccountData.addressAccounts
  );
  useEffect(() => {
    getData();
  }, [currentAccount]);

  interface mapItem {
    id: string;
    ProductName: string;
    description: string;
    imgUrl: string;
    owner: string;
    price: string;
    sellAble: boolean;
  }

  const getData = async () => {
    setLoading(true);
    const provider: any = await detectEthereumProvider();
    const web3 = new Web3(provider);
    if (provider) {
      const productContract = await new web3.eth.Contract(
        //@ts-ignore
        ABI_PRODUCTS,
        ADDRESS_PRODUCTS
      );
      let data = [];
      const count = await productContract.methods.Count().call();

      for (let i = 1; i <= count; i++) {
        const item = await productContract.methods.items(i).call();
        if (
          typeof item.Owner === "string" &&
          typeof currentAccount[0] === "string"
        ) {
          if (item.Owner.toLowerCase() === currentAccount[0].toLowerCase()) {
            data.push({
              id: item.Id,
              ProductName: item.ProductName,
              description: item.descriptors,
              imgUrl: item.ImgUrl,
              owner: item.Owner,
              price: item.Price,
              sellAble: item.SellAble,
            });
          }
        }
      }
      setProduct(data);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };
  const dispatch = useDispatch();
  const handelDeleteBtn = async (id: any) => {
    const provider: any = await detectEthereumProvider();
    if (provider) {
      const web3 = new Web3(provider);
      const ProductContract = new web3.eth.Contract(
        //@ts-ignore
        ABI_PRODUCTS,
        ADDRESS_PRODUCTS
      );
      try {
        await ProductContract.methods
          .DeleteProduct(id)
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
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loading}>
          <SmallLoading />
          <h2>Loading</h2>
        </div>
      ) : null}
      <div className={styles.cards}>
        {product.length > 0 ? (
          <>
            {product.map((item: mapItem) => {
              return (
                <div className={styles.card} key={item.id}>
                  {typeof item.owner === "string" ? (
                    <>
                      <div className={styles.imgContainer}>
                        <div className={styles.img}>
                          <img src={item.imgUrl} alt={item.ProductName} />
                        </div>
                      </div>
                      <div className={styles.data}>
                        <div className={styles.productName}>
                          {item.ProductName}
                        </div>
                        <div className={styles.owner}>
                          <span>
                            {item.owner.substring(0, 5)}...
                            {item.owner.substring(item.owner.length - 4)}
                          </span>
                          <div className={styles.iconCopy}>
                            <CopyToClipboard text={item.owner}>
                              <div>
                                <AiFillCopy />
                              </div>
                            </CopyToClipboard>
                          </div>
                        </div>
                        <div className={styles.description}>
                          <span>Description</span>
                          <div>{item.description}</div>
                        </div>
                        <div className={styles.Price}>
                          {item.price}
                          <span>Loop</span>
                        </div>

                        <div
                          className={styles.sellAble}
                          style={
                            item.sellAble
                              ? {
                                  backgroundColor: "rgba(166, 255, 0, 0.185)",
                                  color: "rgb(115, 255, 0)",
                                }
                              : {
                                  backgroundColor: " rgba(250, 50, 0, 0.185)",
                                  color: "rgb(255, 0, 0)",
                                }
                          }
                        >
                          {item.sellAble ? "on sale" : "not on sale"}{" "}
                        </div>
                      </div>
                      <div className={styles.btnContainer}>
                        <div className={styles.btnDelete}>
                          <span onClick={() => handelDeleteBtn(item.id)}>
                            Delete
                          </span>
                        </div>
                        <div className={styles.btnEdit}>
                          <Link href={`Dashboard/Edit/${item.id}`}>
                            <span>Edit</span>
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              );
            })}
          </>
        ) : (
          <div className={styles.basket}>
            <div>
              <Image src={Basket} />
            </div>
            <h3>you don't have any product</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProduct;
