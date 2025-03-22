import { useEffect, useState } from "react";
// import Chevron from "./Chevron";
import { CurrencyChainOption } from "../../types.ts";

export default function Dropdown({
  options,
  callback,
  selected = null,
  label,
}: {
  options: CurrencyChainOption[];
  callback: (option: CurrencyChainOption) => void | Promise<void>;
  selected?: null | CurrencyChainOption;
  label: string;
}) {
  const [selectedOption, setSelectedOption] = useState<
    CurrencyChainOption | null
  >(selected);

  useEffect(() => {
    selected && setSelectedOption(selected);
  }, [selected]);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedValue = options.find((opt) => opt.label === e.target.value);
    if (!selectedValue) {
      throw new Error("Something went wrong in currency dropdown");
    }
    setSelectedOption(selectedValue);
    callback(selectedValue);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="flex flex-col"
    >
      <label className="font-medium">{label}</label>
      <select
        onChange={(e) => handleChange(e)}
        value={selectedOption?.label || ""}
      >
        <option value="" disabled>Select a currency</option>
        {options.map((option) => (
          <option key={option.label} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
    </form>
  );
}
