import React, { useState } from "react";
import Chevron from "./Chevron";
import { Option } from "@/types";
const Dropdown = ({
  options,
  callback,
}: {
  options: Option[];
  callback: (option: Option) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    callback(option);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          data-testid="dropdown"
          type="button"
          className="flex items-center w-full rounded-md border shadow-sm px-4 py-2 bg-background-gray"
          onClick={toggleDropdown}
        >
          <p className="mr-2">
            {selectedOption ? selectedOption.label : "Select an option"}
          </p>
          <div className="ml-auto align-center">
            <Chevron open={isOpen} hex={"#000"} />
          </div>
        </button>
      </div>

      {isOpen && (
        <div className="border-2 border-solid mt-1 p-2 rounded-2xl">
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
