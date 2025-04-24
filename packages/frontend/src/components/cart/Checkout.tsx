import { useNavigate } from "@tanstack/react-router";
import Cart from "./Cart.tsx";

export default function Checkout() {
  const navigate = useNavigate();
  function onCheckout() {
    navigate({
      to: "/shipping",
      search: (prev: Record<string, string>) => ({
        shopId: prev.shopId,
      }),
    });
  }
  return (
    <main data-testid="checkout-screen" className="flex justify-center">
      <section className="md:w-[800px]">
        <h1 className="my-5">Cart</h1>
        <Cart onCheckout={onCheckout} />
      </section>
    </main>
  );
}
