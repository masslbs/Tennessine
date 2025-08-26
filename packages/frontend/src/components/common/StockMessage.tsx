interface StockMessageProps {
  stock: number;
}

export default function StockMessage(
  { stock }: StockMessageProps,
) {
  if (!stock) {
    return (
      <div
        className="px-4 py-2 bg-red-800 text-white font-thin rounded-lg flex items-center"
        data-testid="no-stock-msg"
      >
        <p>Sorry this is out of stock</p>
      </div>
    );
  } else if (stock < 5) {
    return (
      <div
        className="px-4 py-2 bg-amber-500 text-white font-thin rounded-lg flex items-center"
        data-testid="low-stock-msg"
      >
        <p>Only {stock} left in stock</p>
      </div>
    );
  }
  return null;
}
