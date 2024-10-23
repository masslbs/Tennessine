import React, { useState, useEffect } from "react";
import Chevron from "./Chevron";
import { Option } from "@/types";

const Dropdown = ({
  options,
  callback,
  selected = null,
}: {
  options: Option[];
  callback: (option: Option) => void;
  selected?: null | Option;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(selected);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    selected && setSelectedOption(selected);
  }, [selected]);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    callback(option);
  };

  return (
    <div className="text-left">
      <button
        data-testid="dropdown"
        type="button"
        className="flex items-center w-auto rounded-md border shadow-sm px-4 py-2 bg-background-gray"
        onClick={toggleDropdown}
      >
        <p className="mr-2">
          {selectedOption ? selectedOption.label : "Select an option"}
        </p>
        <div className="ml-auto align-center">
          <Chevron open={isOpen} hex={"#000"} />
        </div>
      </button>

      {isOpen && (
        <div className="bg-white border-2 border-solid p-2 ">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {options.map((option) => (
              <a
                key={option.label}
                href="#"
                data-testid={option.label}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
