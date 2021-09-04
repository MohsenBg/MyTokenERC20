import "../styles/globals.scss";
import type { AppProps } from "next/app";
import NavBar from "../component/NavBar/NavBar";
import { Provider } from "react-redux";
import { store } from "../Redux/store";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect } from "react";
import Dispatcher from "../component/Dispatcher/Dispatcher";
import Error from "../component/Error/Error";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <>
        <div>
          <Error />
        </div>
        <Dispatcher />
        <div className="App">
          <div className="NavBar">
            <NavBar />
          </div>
          <div className="mainContents">
            <Component {...pageProps} />
          </div>
        </div>
      </>
    </Provider>
  );
}
export default MyApp;