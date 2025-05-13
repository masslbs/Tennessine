import Transactions from "./Transactions.tsx";
import BackButton from "../common/BackButton.tsx";

export default function Orders() {
  return (
    <main className="px-4 md:flex justify-center">
      <section
        data-testid-="transactions-container"
        className="md:w-[560px]"
      >
        <BackButton />
        <h1>Orders</h1>
        <Transactions />
      </section>
    </main>
  );
}
