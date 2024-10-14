// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useEffect } from "react";

interface ValidationWarningProps {
  warningMessage: string | null;
  onClose: () => void;
}

const ValidationWarning: React.FC<ValidationWarningProps> = ({
  warningMessage,
  onClose,
}) => {
  if (!warningMessage) return null;

  useEffect(() => {
    if (warningMessage) {
      const timeoutId = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [warningMessage, onClose]);

  return (
    <div className="pl-4 py-2 bg-orange-400">
      <p>{warningMessage}</p>
    </div>
  );
};

export default ValidationWarning;
