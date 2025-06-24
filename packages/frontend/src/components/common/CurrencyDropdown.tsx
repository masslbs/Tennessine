import { useEffect, useState } from "react";
// import Chevron from "./Chevron";
import { CurrencyChainOption } from "../../types.ts";

export default function Dropdown({
  options,
  callback,
  selected = null,
  label,
  testId = "currency-dropdown",
}: {
  options: CurrencyChainOption[] | null;
  callback: (option: CurrencyChainOption) => void | Promise<void>;
  selected?: null | CurrencyChainOption;
  label: string;
  testId?: string;
}) {
  const [selectedOption, setSelectedOption] = useState<
    CurrencyChainOption | null
  >(selected);

  useEffect(() => {
    selected && setSelectedOption(selected);
  }, [selected]);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedValue = options?.find((opt) => opt.label === e.target.value);
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
      data-testid={testId}
    >
      <label className="font-medium text-base mb-1">{label}</label>
      <select
        onChange={(e) => handleChange(e)}
        value={selectedOption?.label || ""}
        style={{ backgroundColor: "#F3F3F3", padding: 10, borderRadius: 8 }}
      >
        <option value="" disabled>Select a currency</option>
        {options?.map((option) => (
          <option
            data-testid={`${testId}-option-${option.label}`}
            key={option.label}
            value={option.label}
          >
            {option.label}
          </option>
        ))}
      </select>
    </form>
  );
}
