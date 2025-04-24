export default function PriceSummary(
  { displayedAmount, tokenIcon }: {
    displayedAmount: string | null;
    tokenIcon: string;
  },
) {
  return (
    <div className={displayedAmount ? "" : "hidden"}>
      <p>Total price</p>
      <div className="flex items-center gap-2">
        <img
          src={tokenIcon}
          alt="coin"
          width={24}
          height={24}
          className="w-6 h-6 max-h-6"
        />
        <h1 data-testid="total-price">{displayedAmount}</h1>
      </div>
    </div>
  );
}
