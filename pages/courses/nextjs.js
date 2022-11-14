import { useRouter } from "next/router";

const NextJs = () => {
  const router = useRouter();
  console.log("router", router);
  return <div>Welcome to Next Js with Ankita!</div>;
};

export default NextJs;
