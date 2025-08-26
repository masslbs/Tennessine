interface StockMessageProps {
  stock: number;
  isToast?: boolean;
}

export default function StockMessage(
  { stock, isToast = false }: StockMessageProps,
) {
  if (!stock) {
    return (
      <div
        className={`px-4 py-2 bg-red-800 text-white font-thin flex items-center ${
          isToast ? "rounded-lg" : "rounded-b-lg"
        }`}
        data-testid="no-stock-msg"
      >
        <p>{`Sorry this is ${isToast ? "" : "now"} out of stock`}</p>
      </div>
    );
  } else if (stock < 5) {
    return (
      <div
        className={`px-4 py-2 bg-amber-500 text-white font-thin flex items-center ${
          isToast ? "rounded-lg" : "rounded-b-lg"
        }`}
        data-testid="low-stock-msg"
      >
        <p>Only {stock} left in stock</p>
      </div>
    );
  }
  return null;
}
