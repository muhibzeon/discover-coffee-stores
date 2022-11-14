import { useRouter } from "next/router";
import Link from "next/link";

const CoffeeStore = () => {
  const router = useRouter();
  return (
    <div>
      Coffee Store Page {router.query.id}
      <Link href="/">Back to Home</Link>
      <Link href="/courses/nextjs">Go to courses</Link>
    </div>
  );
};

export default CoffeeStore;
