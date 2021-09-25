import detectEthereumProvider from "@metamask/detect-provider";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import { ActionTypeAccountInfo } from "../../Redux/AccountInfo/ActionType/ActionType";
import {
  ABI_LOOP_TOKEN_CONTRACT,
  ABI_SELL_CONTRACT,
  ADDRESS_LOOP_TOKEN,
  ADDRESS_SELL_TOKEN,
  ADDRESS_PRODUCTS,
} from "../../config_Contracts";
import { ActionTypeLoopToken } from "../../Redux/LoopToken/ActionType";
import { initialState } from "../../Redux/store";
import { ActionTypeContractSale } from "../../Redux/ContractSale/ActionType";
import { ActionTypeError } from "../../Redux/Error/ActionType";
import { ErrorTypes } from "../Error/ErrorType/ErrorType";
import { useRouter } from "next/router";
const Dispatcher = () => {
  const dispatch = useDispatch();
  const [blockNumber, setBlockNumber] = useState<any>("");
  const [statusChainID, setStatusChainID] = useState<Boolean>(false);

  const currentAccount = useSelector(
    (state: typeof initialState) => state.AccountData.addressAccounts
  );

  const router = useRouter();
  //** chainIdHandler
  useEffect(() => {
    const OnChangeChainId = async () => {
      const providerMetaMask: any = await detectEthereumProvider();
      if (providerMetaMask) {
        //@ts-ignore
        providerMetaMask.on("chainChanged", async (chainId: string) => {
          await router.push("/", undefined, { shallow: false });
          window.location.reload();
        });
      }
    };
    OnChangeChainId();
  }, []);

  //** auto Connect
  useEffect(() => {
    const handelWalletIsConnected = async () => {
      const provider: any = await detectEthereumProvider();
      if (provider) {
        //Meta Mask installed
        const web3 = new Web3(provider);
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        ChainId(web3);
        setAccount(accounts);
        CheckChainId(web3);
        if (statusChainID) {
          BalanceOfETH(web3, accounts);
          BalanceOfLoopToken(web3, accounts);
          BalanceContractSale(web3, accounts);
          Approval(web3, accounts);
        }
      }
    };
    handelWalletIsConnected();
  }, [statusChainID]);

  //** onChange Account
  useEffect(() => {
    const handelAccountChange = async () => {
      const provider: any = await detectEthereumProvider();
      if (provider) {
        const web3 = new Web3(provider);
        await provider.on("accountsChanged", async (accounts: any) => {
          ChainId(web3);
          CheckChainId(web3);
          setAccount(accounts);
          if (statusChainID) {
            BalanceOfETH(web3, accounts);
            BalanceOfLoopToken(web3, accounts);
            BalanceContractSale(web3, accounts);
            Approval(web3, accounts);
          }
        });
      }
    };
    handelAccountChange();
  }, [statusChainID]);

  //**onBlackNumberChange
  useEffect(() => {
    const onBlackNumberChange = async () => {
      const provider: any = await detectEthereumProvider();
      if (provider) {
        if (currentAccount.length >= 1) {
          const web3 = new Web3(provider);
          const accounts = await provider.request({
            method: "eth_requestAccounts",
          });
          if (statusChainID) {
            BalanceOfETH(web3, accounts);
            BalanceOfLoopToken(web3, accounts);
            Approval(web3, accounts);
          }
        }
      }
    };
    onBlackNumberChange();
  }, [blockNumber]);

  //! lack memory
  const time = 5000;
  let OldBlock: any;
  useEffect(() => {
    const interval = setInterval(async () => {
      const provider: any = await detectEthereumProvider();
      const web3 = new Web3(provider);
      const block = await web3.eth.getBlockNumber();
      if (OldBlock !== block) {
        setBlockNumber(block);
      }
      OldBlock = block;
    }, time);
    return () => clearInterval(interval);
  }, []);
  //!-------------------------------
  const setAccount = async (accounts: any) => {
    if (accounts.length >= 1 && currentAccount.length >= 1) {
      if (
        currentAccount[0].toString().toLowerCase() !==
        accounts.toString().toLowerCase()
      ) {
        dispatch({
          type: ActionTypeAccountInfo.ACCOUNT_ADDRESS,
          payload: accounts,
        });
      }
    } else if (accounts.length >= 1 && currentAccount.length < 1) {
      dispatch({
        type: ActionTypeAccountInfo.ACCOUNT_ADDRESS,
        payload: accounts,
      });
    } else {
      router.push("/", undefined, { shallow: false });
      dispatch({
        type: ActionTypeAccountInfo.ACCOUNT_ADDRESS,
        payload: accounts,
      });
    }
  };

  let current_Balance_ETH: any;
  const BalanceOfETH = async (web3: Web3, accounts: any) => {
    if (accounts.length >= 1) {
      const balance = await web3.eth.getBalance(accounts[0]);
      if (balance !== current_Balance_ETH) {
        dispatch({
          type: ActionTypeAccountInfo.ACCOUNT_BALANCE,
          payload: balance,
        });
        current_Balance_ETH = balance;
      }
    } else {
      if ("" !== current_Balance_ETH) {
        dispatch({
          type: ActionTypeAccountInfo.ACCOUNT_BALANCE,
          payload: "",
        });
        current_Balance_ETH = "";
        web3.eth.getBlockNumber();
      }
    }
  };

  let current_Balance_Loop: any;
  const BalanceOfLoopToken = async (web3: Web3, accounts: any) => {
    if (accounts.length >= 1) {
      const Contract = new web3.eth.Contract(
        //@ts-ignore
        ABI_LOOP_TOKEN_CONTRACT,
        ADDRESS_LOOP_TOKEN
      );
      const Balance = await Contract.methods.balanceOf(accounts[0]).call();
      if (current_Balance_Loop !== Balance) {
        dispatch({
          type: ActionTypeLoopToken.BALANCE,
          balance: Balance,
        });
        current_Balance_Loop = Balance;
      }
    } else {
      if (current_Balance_Loop !== 0) {
        dispatch({
          type: ActionTypeLoopToken.BALANCE,
          balance: 0,
        });
        current_Balance_Loop = 0;
      }
    }
  };

  const Approval = async (web3: Web3, accounts: any) => {
    if (accounts.length >= 1) {
      const Contract = new web3.eth.Contract(
        //@ts-ignore
        ABI_LOOP_TOKEN_CONTRACT,
        ADDRESS_LOOP_TOKEN
      );
      const approval = await Contract.methods
        .allowance(accounts[0], ADDRESS_PRODUCTS)
        .call();

      dispatch({
        type: ActionTypeAccountInfo.APPROVAL,
        payload: approval,
      });
    }
  };

  const ChainId = async (web3: any) => {
    const chainId = await web3.eth.getChainId();
    dispatch({ type: ActionTypeAccountInfo.CHAIN_ID, payload: chainId });
  };

  let balanceSaleLoop: any;
  let balanceSaleEth: any;
  let token_Price: any;
  let token_sold: any;
  let usd: any;
  const BalanceContractSale = async (web3: Web3, accounts: any) => {
    if (accounts.length >= 1) {
      const ContractLoopToken = new web3.eth.Contract(
        //@ts-ignore
        ABI_LOOP_TOKEN_CONTRACT,
        ADDRESS_LOOP_TOKEN
      );
      const ContractSale = new web3.eth.Contract(
        //@ts-ignore
        ABI_SELL_CONTRACT,
        ADDRESS_SELL_TOKEN
      );

      const BalanceOFLoop = await ContractLoopToken.methods
        .balanceOf(ADDRESS_SELL_TOKEN)
        .call();

      if (BalanceOFLoop !== balanceSaleLoop) {
        dispatch({
          type: ActionTypeContractSale.BALANCE_CONTRACT_SALE_LOOP,
          payload: BalanceOFLoop,
        });
      }
      balanceSaleLoop = BalanceOFLoop;
      const BalanceOFETh = await web3.eth.getBalance(ADDRESS_SELL_TOKEN);
      if (BalanceOFETh !== balanceSaleEth) {
        dispatch({
          type: ActionTypeContractSale.BALANCE_CONTRACT_SALE_ETH,
          payload: BalanceOFETh,
        });
      }
      balanceSaleEth = BalanceOFETh;
      const tokenPrice = await ContractSale.methods.tokenPrice().call();
      if (tokenPrice !== token_Price) {
        dispatch({
          type: ActionTypeContractSale.TOKEN_PRICE,
          payload: tokenPrice,
        });
      }
      token_Price = tokenPrice;
      const tokenSold = await ContractSale.methods.tokenSold().call();
      if (tokenSold !== token_sold) {
        dispatch({
          type: ActionTypeContractSale.TOKEN_SOLD,
          payload: tokenSold,
        });
      }
      token_sold = tokenSold;

      const chainId = await web3.eth.getChainId();

      if (chainId === 4) {
        const usdPrice = await ContractSale.methods.usdPrice().call();
        if (usdPrice !== usd) {
          dispatch({
            type: ActionTypeContractSale.USD,
            payload: usdPrice,
          });
        }
        usd = usdPrice;
      }
    }
  };

  const CheckChainId = async (web3: Web3) => {
    let currentChainId: any = await web3.eth.getChainId();
    const chain_id: any = process.env.NEXT_PUBLIC_RINKEBY_CHAIN_ID;
    if (currentChainId.toString() !== chain_id.toString()) {
      dispatch({
        type: ActionTypeError.ON_ERROR,
        title: "Chain ID",
        text: "Please connect to Rinkeby NetWork(ID:4).",
        icon: "error",
        countBtn: 0,
        btn1: "",
        btn2: "",
        hidden: false,
        fontSize: "18px",
        zIndex: 10,
        ErrorType: ErrorTypes.WRONG_CHAIN_ID,
      });
      setStatusChainID(false);
    } else {
      setStatusChainID(true);
    }
  };

  return null;
};

export default Dispatcher;
