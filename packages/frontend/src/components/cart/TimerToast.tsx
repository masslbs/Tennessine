export default function TimerToast() {
  return (
    <div className=" bg-primary-dark-green text-white font-thin rounded-lg flex flex-col p-4">
      <div className="flex gap-2 items-center">
        <img
          src="/icons/timer.svg"
          alt="timer-icon"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        <h3>Your products are reserved</h3>
      </div>
      <p>Your products have been reserved for the next 15 minutes.</p>
    </div>
  );
}
