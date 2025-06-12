import { useNavigate } from "@tanstack/react-router";
import Cart from "./Cart.tsx";
import BackButton from "../common/BackButton.tsx";

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
    <main data-testid="checkout-screen" className="flex justify-center px-4">
      <section className="w-full md:w-[1000px]">
        <BackButton />
        <h1 className="my-[10px]">Cart</h1>
        <Cart onCheckout={onCheckout} />
      </section>
    </main>
  );
}
