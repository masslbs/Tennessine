import { useNavigate } from "@tanstack/react-router";

import { Listing } from "@massmarket/schema";
import { useStateManager } from "@massmarket/react-hooks";

import BackButton from "../../common/BackButton.tsx";
import { ListingViewState } from "../../../types.ts";

export default function DeleteListing({ listing }: { listing: Listing }) {
  const { stateManager } = useStateManager();
  const navigate = useNavigate();

  async function handleDelete() {
    await stateManager?.set(
      ["Listings", listing.ID, "ViewState"],
      ListingViewState.Deleted,
    );
    navigate({
      to: "/listings",
      search: (prev: Record<string, string>) => ({
        shopId: prev.shopId,
      }),
    });
  }
  return (
    <main className="px-5 md:flex justify-center">
      <section className="md:w-[560px]">
        <BackButton />
        <h2 className="py-[10px]">Delete product</h2>
        <section className="bg-white p-5 rounded-lg flex flex-col gap-5">
          <p className="font-light">
            Are you sure you would like to delete the following products?
          </p>
          <p className="font-bold">{listing.Metadata.Title}</p>
          <button
            className="w-fit bg-red-700 px-3 py-2 rounded-lg text-white"
            onClick={handleDelete}
            type="button"
          >
            Delete product
          </button>
        </section>
      </section>
    </main>
  );
}
