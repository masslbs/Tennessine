import { useNavigate } from "@tanstack/react-router";
import CartItems from "./CartItems.tsx";
import BackButton from "../common/BackButton.tsx";
import Button from "../common/Button.tsx";

export default function Checkout() {
  const navigate = useNavigate();

  return (
    <main data-testid="checkout-screen" className="flex justify-center px-4">
      <section className="w-full md:w-140">
        <BackButton />
        <h1 className="my-[10px]">Checkout</h1>
        <CartItems />
        <div className="px-5 pb-5 bg-white rounded-b-lg">
          <Button
            onClick={() => {
              navigate({
                to: "/shipping",
                search: (prev: Record<string, string>) => ({
                  shopId: prev.shopId,
                }),
              });
            }}
          >
            <div className="flex items-center gap-2">
              <p>
                Shipping Details
              </p>
              <img
                src="/icons/white-arrow.svg"
                alt="white-arrow"
                width={7}
                height={12}
              />
            </div>
          </Button>
        </div>
      </section>
    </main>
  );
}
