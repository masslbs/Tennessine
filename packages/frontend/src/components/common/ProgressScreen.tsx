export default function ProgressScreen(
  { step, text, avatar }: {
    step: number;
    text: string;
    avatar: FormData | null;
  },
) {
  let avatarUrl: string | null = null;
  if (avatar) {
    const file = avatar.get("file") as File;
    avatarUrl = URL.createObjectURL(file);
  }

  return (
    <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg">
      {avatarUrl && (
        <div className="w-20 h-20">
          <img src={avatarUrl} alt="smiley-icon" />
        </div>
      )}
      <h1 data-testid="shop-registration-status">
        {text}
      </h1>
      <div className="relative">
        <div className="absolute w-60 h-[10px] bg-gray-200 rounded-full"></div>
        {/* FIXME: Browser cannot seem to render tailwind values that are calculated dynamically? i.e. w-${step * 15} */}
        <div
          className={`absolute z-1 h-[10px] bg-black rounded-full ${
            step === 1
              ? "w-15"
              : step === 2
              ? "w-30"
              : step === 3
              ? "w-45"
              : "w-60"
          }`}
        >
        </div>
      </div>
    </section>
  );
}
