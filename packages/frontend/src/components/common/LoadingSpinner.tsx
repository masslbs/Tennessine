import { useEffect, useState } from "react";

export default function LoadingSpinner() {
  const [currentSpinner, setCurrentSpinner] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpinner((prev: number) => (prev % 12) + 1);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-10 h-10">
      <img
        src={`/icons/spinners/spinner-${currentSpinner}.svg`}
        alt="Loading spinner"
        width={80}
        height={80}
      />
    </div>
  );
}
