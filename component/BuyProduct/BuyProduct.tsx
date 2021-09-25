import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ABI_PRODUCTS, ADDRESS_PRODUCTS } from "../../config_Contracts";
import Image from "next/image";
import detectEthereumProvider from "@metamask/detect-provider";
import { initialState } from "../../Redux/store";
import Web3 from "web3";
import styles from "./BuyProduct.module.scss";
import { AiFillCopy } from "react-icons/ai";
import CopyToClipboard from "react-copy-to-clipboard";
import { ActionTypeError } from "../../Redux/Error/ActionType";
import { ErrorTypes } from "../Error/ErrorType/ErrorType";
import Basket from "../../public/assets/other/basket.png";
import { ActionTypeLoading } from "../../Redux/Loading/Actions";
import PanelBuy from "../panelBuy/PanelBuy";
const BuyProduct = () => {
  const [panelId, setPanelId] = useState<any>("");
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
    dispatch({
      type: ActionTypeLoading.ON_LOADING,
    });
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
          if (
            item.SellAble &&
            currentAccount[0].toLowerCase() !== item.Owner.toLowerCase()
          ) {
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
        dispatch({
          type: ActionTypeLoading.END_LOADING,
        });
      }, 2000);
    }
  };
  const dispatch = useDispatch();
  const handelBuyBtn = async (id: any) => {
    setPanelId(id);
  };

  return (
    <div className={styles.container}>
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
                      </div>
                      <div className={styles.btnContainer}>
                        <div className={styles.btnBuy}>
                          <span onClick={() => handelBuyBtn(item.id)}>Buy</span>
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
            <Image src={Basket} width={350} height={200} />
            <h1>No Product for sale</h1>
          </div>
        )}
      </div>
      {panelId !== "" ? (
        <div className={styles.panelBuy}>
          <PanelBuy id={panelId} Close={() => setPanelId("")} />
        </div>
      ) : null}
    </div>
  );
};

export default BuyProduct;
