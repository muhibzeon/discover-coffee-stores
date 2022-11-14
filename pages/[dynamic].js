import { useRouter } from "next/router";
import Head from "next/head";

const Dynamic = () => {
  let router;
  router = useRouter();
  return (
    <div>
      <Head>
        <title>{router.query.dynamic}</title>
      </Head>
      Hi it is a dynamic page of title: {router.query.dynamic}
    </div>
  );
};

export default Dynamic;
