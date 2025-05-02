import Transactions from "./Transactions.tsx";

export default function Orders() {
  return (
    <main className="p-4 md:flex justify-center">
      <section
        data-testid-="transactions-container"
        className="md:w-[560px]"
      >
        <h1>Orders</h1>
        <Transactions />
      </section>
    </main>
  );
}
