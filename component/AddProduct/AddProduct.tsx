import axios from "axios";
import React, { useState } from "react";
import styles from "./AddProduct.module.scss";
import { ImUpload2 } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { initialState } from "../../Redux/store";
import { ActionTypeError } from "../../Redux/Error/ActionType";
import { ErrorTypes } from "../Error/ErrorType/ErrorType";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { ABI_PRODUCTS, ADDRESS_PRODUCTS } from "../../config_Contracts";
const AddProduct = () => {
  const [fileUrl, setFileUrl] = useState<any>("");
  const [productName, setProductName] = useState<any>("");
  const [description, setDescription] = useState<any>("");
  const [price, setPrice] = useState<any>(0);
  const [sellAble, setSellAble] = useState<any>(false);

  const [warning, setWarning] = useState({
    ProductName: "fill Input  Product Name ",
    ImageUrl: "Upload your Image",
    Description: "fill Input Description",
    Price: "",
  });

  const dispatch = useDispatch();

  const currentAccount = useSelector(
    (state: typeof initialState) => state.AccountData.addressAccounts
  );

  const getFile = async (file: any) => {
    if (file.length > 0) {
      if (file[0].size <= 500000) {
        if (file[0].type.includes("image")) {
          const formData: any = new FormData();
          formData.append("file", file[0]);
          formData.append("upload_preset", "product Image");
          await axios
            .post(
              `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_KEY}/image/upload`,
              formData
            )
            .then((response) => {
              let Waring = warning;
              warning.ImageUrl = "";
              setWarning(Waring);
              setFileUrl(response.data.url);
            });
        } else {
          dispatch({
            type: ActionTypeError.ON_ERROR,
            title: "Add Product",
            text: "File should be Image.",
            icon: "error",
            countBtn: 1,
            btn1: "ok",
            btn2: "",
            hidden: false,
            fontSize: "18px",
            zIndex: 10,
            ErrorType: ErrorTypes.ADD_PRODUCT,
          });
        }
      } else {
        dispatch({
          type: ActionTypeError.ON_ERROR,
          title: "Add Product",
          text: "File should less than 500KB.",
          icon: "error",
          countBtn: 1,
          btn1: "ok",
          btn2: "",
          hidden: false,
          fontSize: "18px",
          zIndex: 10,
          ErrorType: ErrorTypes.ADD_PRODUCT,
        });
      }
    }
  };

  const ValueProductName = (product_name: any) => {
    setProductName(product_name);
    let Waring = warning;
    if (product_name.length > 0) {
      Waring.ProductName = "";
      setWarning(Waring);
    } else {
      Waring.ProductName = "fill Input Product Name";
      setWarning(Waring);
    }
  };

  const ValueDescription = (Description: any) => {
    setDescription(Description);
    let Waring = warning;
    if (Description.length > 0) {
      Waring.Description = "";
      setWarning(Waring);
    } else {
      Waring.Description = "fill Input Product Name";
      setWarning(Waring);
    }
  };

  const ValuePrice = (Price: any) => {
    setPrice(Price);
    let Waring = warning;
    if (Price.length > 0 && parseFloat(Price) % 1 === 0) {
      if (parseFloat(Price) >= 1) {
        Waring.Price = "";
        setWarning(Waring);
      } else {
        Waring.Price = "Input Price should be bigger than zero";
        setWarning(Waring);
      }
    } else if (Price.length > 0 && !(parseFloat(Price) % 1 === 0)) {
      Waring.Price = "Input Price should be integer";
      setWarning(Waring);
    } else {
      Waring.Price = "fill Input Price";
      setWarning(Waring);
    }
  };
  const HandelAddProduct = async () => {
    const check =
      warning.ProductName === "" &&
      warning.Price === "" &&
      warning.Description === "" &&
      warning.ImageUrl === "";
    if (check) {
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
            .AddProduct(
              `${productName}`,
              `${description}`,
              `${fileUrl}`,
              price,
              sellAble
            )
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
    } else {
      dispatch({
        type: ActionTypeError.ON_ERROR,
        title: "Add Product",
        text: "Make sure all Conation true.",
        icon: "error",
        countBtn: 1,
        btn1: "ok",
        btn2: "",
        hidden: false,
        fontSize: "18px",
        zIndex: 10,
        ErrorType: ErrorTypes.ADD_PRODUCT,
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.imageContainer}>
          <div className={styles.Upload}>
            <input type="file" onChange={(e) => getFile(e.target.files)} />
            {fileUrl === "" ? (
              <div className={styles.iconsUpload}>
                <ImUpload2 />
                <span className={styles.text}>Upload your Image</span>
              </div>
            ) : (
              <div className={styles.img}>
                <div
                  className={styles.iconDelete}
                  onClick={() => {
                    let Waring = warning;
                    warning.ImageUrl = "Upload your Image";
                    setWarning(Waring);
                    setFileUrl("");
                  }}
                >
                  <MdDelete />
                </div>
                <div className={styles.cover}>
                  <img src={fileUrl} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.warningContainer}>
          {warning.ImageUrl !== "" ? (
            <span className={styles.warning}>{warning.ImageUrl}</span>
          ) : null}
        </div>
        <div className={styles.ProductData}>
          <div className={styles.input}>
            <span className={styles.text}>ProductName</span>
            <input
              type="text"
              onChange={(e) => ValueProductName(e.target.value)}
              placeholder="productName"
              name="Name product"
            />
            <div className={styles.warningContainer}>
              {warning.ProductName !== "" ? (
                <span className={styles.warning}>{warning.ProductName}</span>
              ) : null}
            </div>
          </div>
          <div className={styles.input}>
            <span className={styles.text}>Description</span>
            <textarea
              placeholder="Description"
              onChange={(e) => ValueDescription(e.target.value)}
              name="Description"
            />
            <div className={styles.warningContainer}>
              {warning.Description !== "" ? (
                <span className={styles.warning}>{warning.Description}</span>
              ) : null}
            </div>
          </div>
          <div className={styles.input}>
            <span className={styles.text}>Price (Loop)</span>
            <input
              onChange={(e) => ValuePrice(e.target.value)}
              type="Number"
              defaultValue={1}
              placeholder="Price"
              min={1}
              name="Price"
            />
            <div className={styles.warningContainer}>
              {warning.Price !== "" ? (
                <span className={styles.warning}>{warning.Price}</span>
              ) : null}
            </div>
          </div>
          <div className={`${styles.input} ${styles.sell}`}>
            <input
              type="checkbox"
              name="sellAble"
              className={`${styles.sellAble}`}
              onChange={(e) => setSellAble(e.target.checked)}
            />
            <span>sellAble</span>
          </div>
        </div>
        <div className={styles.btnContainer}>
          <div className={styles.btn} onClick={HandelAddProduct}>
            Add Product
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
