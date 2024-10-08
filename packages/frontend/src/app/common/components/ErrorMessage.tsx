// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useEffect } from "react";

interface ErrorMessageProps {
  errorMessage: string | null;
  onClose: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  errorMessage,
  onClose,
}) => {
  if (!errorMessage) return null;

  useEffect(() => {
    if (errorMessage) {
      const timeoutId = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [errorMessage, onClose]);

  return (
    <div className="pl-4 py-2 bg-red-400">
      <p>{errorMessage}</p>
    </div>
  );
};

export default ErrorMessage;
