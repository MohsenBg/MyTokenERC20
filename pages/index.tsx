import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import Image from "next/image";
import InfinityImg from "../public/assets/HomePage/Infinity-5.9s-800px.svg";
const Home: NextPage = () => {
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Home</title>
          <meta name="Home" content="Home" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <div className={styles.infinityImg}>
            <Image src={InfinityImg} alt="infinityImg" />
          </div>
          <div className={styles.title}>LOOP TOKEN</div>
        </main>
      </div>
    </>
  );
};

export default Home;
