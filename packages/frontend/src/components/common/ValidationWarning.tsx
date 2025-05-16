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
    <div className="mt-2 px-4 py-2 bg-warning-yellow text-white font-thin rounded-lg flex items-center">
      <div className="flex flex-col">
        <h3>Validation Warning</h3>
        <p>{warning}</p>
      </div>
      <button
        onClick={() => onClose()}
        className="ml-auto"
        style={{ backgroundColor: "transparent", padding: 0 }}
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
