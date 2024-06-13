"use client";
import React from "react";

const ProgressBar = ({ currentStep }: { currentStep: number }) => {
  const active = "bg-primary-button border-2	border-gray-400";
  const round = "border rounded-full w-4 h-4";
  const line = "h-0.5 bg-gray-400 flex-1";

  return (
    <main>
      <div className="flex items-center	self-stretch mt-10 w-full mb-2">
        <div
          className={`${round} ${currentStep === 1 ? active : "bg-gray-400"}`}
        />
        <div className={line} />
        <div
          className={`${round} ${currentStep === 2 ? active : "bg-gray-400"}`}
        />
        <div className={line} />
        <div
          className={`${round} ${currentStep === 3 ? active : "bg-gray-400"}`}
        />
        <div className={line} />
        <div
          className={`${round} ${currentStep === 4 ? active : "bg-gray-400"}`}
        />
      </div>
      <div className="flex text-xs justify-between">
        <p className={`${currentStep === 1 ? "" : "opacity-0 w-5"} `}>
          Review Cart
        </p>
        <p className={`${currentStep === 2 ? "" : "opacity-0 w-5"} `}>
          Shipping Details
        </p>
        <p className={`${currentStep === 3 ? "" : "opacity-0 w-5"} `}>
          Checkout
        </p>
        <p className={`${currentStep === 4 ? "" : "opacity-0 w-5"}`}>Success</p>
      </div>
    </main>
  );
};

export default ProgressBar;