import { useMyShops } from "@massmarket/react-hooks";

import ButtonLink from "../common/ButtonLink.tsx";

export default function MyShops() {
  const { shops } = useMyShops();
  return (
    <main
      className="p-5 md:flex justify-center"
      data-testid="connect-merchant"
    >
      <section className="md:w-[560px] w-full">
        <section className="mt-2 flex flex-col items-center gap-1 bg-white p-5 rounded-lg">
          <div className="w-10 h-10">
            <img
              src="/icons/smiley.svg"
              width={80}
              height={80}
              alt="smiley-icon"
              className="w-auto h-auto"
            />
          </div>

          <h1 className="py-[10px]">My Shops</h1>
        </section>
        <section
          className={`${
            !shops?.length
              ? "hidden"
              : "mt-2 flex flex-col gap-1 bg-white p-5 rounded-lg"
          }`}
        >
          {shops?.map((shop, i) => (
            <div key={i}>
              <div className="flex items-center gap-2">
                <img src={shop.image} alt={shop.name} className="w-12 h-12" />
                <h2>{shop.name}</h2>
              </div>

              <p>{shop.description}</p>
              <ButtonLink to={`/merchants?shopId=${shop.id}`}>
                Shop Dashboard
              </ButtonLink>
            </div>
          ))}
        </section>
        <section className="mt-2 flex flex-col gap-1 bg-white p-5 rounded-lg">
          <h1>Create a new shop</h1>
          <ButtonLink to="/create-shop">Get started</ButtonLink>
        </section>
      </section>
    </main>
  );
}
