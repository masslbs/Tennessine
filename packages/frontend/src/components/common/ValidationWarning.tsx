// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

interface ValidationWarningProps {
  warning: string | null;
  onClose: () => void;
}

export default function ValidationWarning({
  warning,
  onClose,
}: ValidationWarningProps) {
  if (!warning) return null;

  return (
    <div className="px-4 py-2 bg-warning-yellow text-white font-thin rounded-lg flex items-center">
      <p>{warning}</p>
      <button
        onClick={() => onClose()}
        className="ml-auto bg-transparent"
        type="button"
      >
        <div className="bg-white rounded-full w-4 h-4 flex justify-center items-center">
          <img
            src="/icons/close-icon.svg"
            alt="close-icon"
            width={8}
            height={8}
            className="w-2 h-2"
          />
        </div>
      </button>
    </div>
  );
}
