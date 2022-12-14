import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Base } from "next/dist/client/components/react-dev-overlay/internal/styles/Base";
import Banner from "../Components/banner";

export default function Home() {
  const handleBannerBtnOnClick = () => {
    console.log("Hi there");
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText="view available stores"
          handleOnClick={handleBannerBtnOnClick}
        />
      </main>
    </div>
  );
}
