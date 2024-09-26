// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";
import Image from "next/image";

interface ValidationWarningProps {
  warning: string | null;
  onClose: () => void;
}

const ValidationWarning: React.FC<ValidationWarningProps> = ({
  warning,
  onClose,
}) => {
  if (!warning) return null;

  return (
    <div className="px-4 py-2 bg-warning-yellow text-white font-thin rounded-lg flex items-center">
      <p>{warning}</p>
      <button onClick={() => onClose()} className="ml-auto">
        <div className="bg-white rounded-full w-4 h-4 flex justify-center">
          <Image
            src="/icons/close-icon.svg"
            alt="close-icon"
            width={7}
            height={7}
            className="w-auto h-auto"
          />
        </div>
      </button>
    </div>
  );
};

export default ValidationWarning;
