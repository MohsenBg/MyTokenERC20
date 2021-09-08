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
} from "../../config_Contracts";
import { ActionTypeLoopToken } from "../../Redux/LoopToken/ActionType";
import { initialState } from "../../Redux/store";
import { ActionTypeContractSale } from "../../Redux/ContractSale/ActionType";
import { ActionTypeError } from "../../Redux/Error/ActionType";
import { ErrorTypes } from "../Error/ErrorType/ErrorType";
import { useRouter } from "next/router";
const Dispatcher = () => {
  const dispatch = useDispatch();

  const [statusChainID, setStatusChainID] = useState<Boolean>(false);

  const currentAccount = useSelector(
    (state: typeof initialState) => state.AccountData.addressAccounts
  );

  const ContractSaleETH = useSelector(
    (state: typeof initialState) => state.ContractSale.BalanceETH
  );
  const ContractSaleLoop = useSelector(
    (state: typeof initialState) => state.ContractSale.BalanceLoopToken
  );
  const TokenPrice = useSelector(
    (state: typeof initialState) => state.ContractSale.TokenPrice
  );
  const TokenSold = useSelector(
    (state: typeof initialState) => state.ContractSale.TokenSold
  );

  const currentBalanceETH = useSelector(
    (state: typeof initialState) => state.AccountData.balance
  );
  const currentBalanceLoop = useSelector(
    (state: typeof initialState) => state.LoopToken.balance
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
          }
        });
      }
    };
    handelAccountChange();
  }, [statusChainID]);

  useEffect(() => {
    if (currentAccount.length < 1) {
      router.push("/", undefined, { shallow: false });
    }
  }, []);

  {
    //! didn't use for lack memory
    // const time = 5000;
    // useEffect(() => {
    //   const interval = setInterval(async () => {
    //     const provider: any = await detectEthereumProvider();
    //     const web3 = new Web3(provider);
    //     if (provider) {
    //       BalanceOfETH(web3, currentAccount);
    //       BalanceOfLoopToken(web3, currentAccount);
    //     }
    //   }, time);
    //   return () => clearInterval(interval);
    // }, []);
  }

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
    }
  };

  const BalanceOfETH = async (web3: Web3, accounts: any) => {
    if (accounts.length >= 1) {
      const balance = await web3.eth.getBalance(accounts[0]);
      if (balance !== currentBalanceETH) {
        dispatch({
          type: ActionTypeAccountInfo.ACCOUNT_BALANCE,
          payload: balance,
        });
      }
    } else {
      dispatch({
        type: ActionTypeAccountInfo.ACCOUNT_BALANCE,
        payload: "",
      });
    }
  };

  const BalanceOfLoopToken = async (web3: Web3, accounts: any) => {
    if (accounts.length >= 1) {
      const Contract = new web3.eth.Contract(
        //@ts-ignore
        ABI_LOOP_TOKEN_CONTRACT,
        ADDRESS_LOOP_TOKEN
      );
      const Balance = await Contract.methods.balanceOf(accounts[0]).call();
      if (currentBalanceLoop !== Balance) {
        dispatch({
          type: ActionTypeLoopToken.BALANCE,
          balance: Balance,
        });
      }
    } else {
      dispatch({
        type: ActionTypeLoopToken.BALANCE,
        balance: 0,
      });
    }
  };

  const ChainId = async (web3: any) => {
    const chainId = await web3.eth.getChainId();
    dispatch({ type: ActionTypeAccountInfo.CHAIN_ID, payload: chainId });
  };

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
      if (BalanceOFLoop !== ContractSaleLoop) {
        dispatch({
          type: ActionTypeContractSale.BALANCE_CONTRACT_SALE_LOOP,
          payload: BalanceOFLoop,
        });

        const BalanceOFETh = await web3.eth.getBalance(ADDRESS_SELL_TOKEN);
        if (BalanceOFETh !== ContractSaleETH) {
          dispatch({
            type: ActionTypeContractSale.BALANCE_CONTRACT_SALE_ETH,
            payload: BalanceOFETh,
          });
        }
        const tokenPrice = await ContractSale.methods.tokenPrice().call();
        if (tokenPrice !== TokenPrice) {
          dispatch({
            type: ActionTypeContractSale.TOKEN_PRICE,
            payload: tokenPrice,
          });
        }
        const tokenSold = await ContractSale.methods.tokenSold().call();
        if (tokenSold !== TokenSold) {
          dispatch({
            type: ActionTypeContractSale.TOKEN_SOLD,
            payload: tokenSold,
          });
        }
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
