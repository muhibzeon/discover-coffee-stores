//Individual Coffee Store page after clicking you will see this

import { useRouter } from "next/router";
import Link from "next/link";
import coffeeStoreData from "../../data/coffee-stores.json";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/coffee-store.module.css";
import cls from "classnames";

import useSWR from "swr";

import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store-context";
import { isEmpty } from "../../utils";

//So similar to index.js(Home Page) we again have to call getStatic props
//The difference is we have to match the clicked stores id and according to that
//We will show the extended infos of that store
export async function getStaticProps(staticProps) {
  const params = staticProps.params;

  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoresById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.fsq_id.toString() === params.id;
  });

  return {
    props: {
      coffeeStore: findCoffeeStoresById ? findCoffeeStoresById : {},
    },
  };
}

//Why this method?
//if a page has Dynamic Routes and uses getStaticProps, it needs to define a list of paths to be statically generated.
export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map((coffeestore) => {
    return {
      params: {
        id: coffeestore.fsq_id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

//Here comes the Coffee Store show method
const CoffeeStore = (initialProps) => {
  const router = useRouter();

  //###So here we are trying to render the coffee stores from the Context
  const id = router.query.id;
  const [kaffeeStore, setKaffeStore] = useState(initialProps.coffeeStore || {});
  const [votingCount, setVotingCount] = useState(0);

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(`/api/getCoffeeStorebyId?id=${id}`, fetcher);
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      //This coffeeStores is from the context
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id; //this id is from the url
        });
        setKaffeStore(coffeeStoreFromContext);
        //handleCreateCoffeeStore(coffeeStoreFromContext);
      }
    }
  }, [id, initialProps.coffeeStore]);

  //###Till here

  //Add the data to the database
  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { fsq_id, location, name, imgUrl } = coffeeStore;
      const id = fsq_id;
      const region = location.region;
      const address = location.formatted_address;

      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          address,
          region,
          voting: 0,
          imgUrl,
        }),
      });

      const dbCoffeeStore = await response.json();
    } catch (err) {
      console.log(err);
    }
  };

  if (isEmpty(initialProps.coffeeStore)) {
    handleCreateCoffeeStore(kaffeeStore);
  } else {
    //SSG
    handleCreateCoffeeStore(initialProps.coffeeStore);
  }

  const { location, name, imgUrl } = kaffeeStore;

  useEffect(() => {
    if (data && data.length > 0) {
      const { address, id, imageUrl, name, region, voting } = data[0];
      const modifiedData = {
        fsq_id: id,
        location: {
          region,
          formatted_address: address,
        },
        name,
        imageUrl,
        voting,
      };

      setKaffeStore(modifiedData);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  //Implementing the upvote counter
  const handleUpVoteButton = async () => {
    try {
      const response = await fetch("/api/favoriteCoffeeStore", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json();
      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.error("Error upvoting the coffee store", err);
    }
  };

  if (error) {
    return <div>Can&apos;t find Coffee Store page!</div>;
  }

  //Check the fall back state
  if (router.isFallback) {
    return <div>Loading</div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/" legacyBehavior>
              <a>Back to Home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>

          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width="600"
            height="360"
            className={styles.storeImg}
            alt={name}
          ></Image>
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/places.svg"
              width="24"
              height="24"
              alt="icon"
            />
            <p className={styles.text}>{location.formatted_address}</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/nearMe.svg"
              width="24"
              height="24"
              alt="icon"
            />
            <p className={styles.text}>{location.region}</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="icon"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpVoteButton}>
            Up Vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
