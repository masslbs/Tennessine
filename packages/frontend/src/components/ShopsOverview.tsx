function ShopCard({ name, description, shopID, _image }) {
  // TODO (2025-06-27 @alp): the max and min widths are a bit arbitrary atm, set them to something more well-defined /
  // based on the designs or some inherent characteristic relating to the image uploads or length of shop name / description text
  // to show before breaking

  // TODO (2025-07-27 @alp): the showCardImage element is pure placeholder for the
  // shop image / avatar. the end-design will dictate // the card dimensions
  // (e.g. in most other views the shop avatar is circular)
  return (
    <div
      className="grid p-2 max-w-[14.25rem] min-w-[7rem] border border-solid border-black rounded-xl"
      key={shopID}
      onClick={() => {
        console.log(`go to ${shopID}`);
      }}
    >
      <div
        className="shopCardImage"
        style={{ background: "teal", minHeight: "5rem", minWidth: "100%" }}
      >
      </div>
      <p className="mt-2 font-extra-bold">{name}</p>
      <p>{description}</p>
      <input
        type="button"
        className="cursor-pointer mt-4 mb-2 text-center"
        value="Visit shop"
      />
    </div>
  );
}

const shops = [{
  name: "Beans",
  description: "We sell quality beans for low costs using intl shipping",
  image: false,
  shopID: "0x01",
}, {
  name: "Watches",
  description:
    "Swiss-made watches with only the most exclusive horological complications",
  image: false,
  shopID: "0x111",
}];

function sortShops(incomingShops, cmp) {
  return incomingShops.sort(cmp);
}

function cmpByName(a, b) {
  return a.name > b.name;
}

// (2025-06-27 @alp): what should be the default sort order? alphabetical by-shop-name? by shopid? "shop created timestamp"?, "shop total value of sales"?
export default function ShopsOverview() {
  // const { setShopDetails } = useShopDetails()
  // TODO (2025-06-27 @alp): this is a hacky way of setting the navigation title - to be refactored :)
  // setShopDetails({name: "Browse shops" })
  // (2025-06-27 - later @alp): hehe it doesn't actually work that well in practice - but it would look clean to show the "Browse shops" in the
  // nav!

  return (
    <main className="w-full md:max-w-[40vw] ml-auto mr-auto">
      <h2 className="pt-8 pb-4">[Insert Tagline]</h2>
      <p className="pb-4 italic">
        Mass Market is a crypto-native, non-custodial commerce protocol for
        physical items, grounding crypto in the real world and connecting the
        potential of DeFi to the market for physical goods.
      </p>
      <div className="grid mt-4 md:grid-cols-[max-content_max-content] md:justify-around grid-cols-1 gap-y-4">
        {sortShops(shops, cmpByName).map(ShopCard)}
      </div>
      <div className="grid w-full mt-8 mb-8 justify-items-center">
        <div
          className="cursor-pointer p-4 font-bold text-xl bg-black text-white rounded-xl border border-solid border-black"
          disabled
        >
          Create shop
        </div>
      </div>
    </main>
  );
}
