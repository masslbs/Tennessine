import { useKeycard } from "@massmarket/react-hooks";

export default function KeycardEnrollModal() {
  const { isLoading } = useKeycard();
  if (!isLoading) return null;

  return (
    <section>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999]" />
      <section className="w-full h-full absolute z-[1000]">
        <section
          className="rounded-sm min-h-[10rem] max-w-[30ch] md:max-w-[47ch] bg-zinc-700 ml-auto mr-auto mt-16 p-4 text-white"
          style={{
            boxShadow: "#212121 4px 4px 2px",
          }}
        >
          <h2 className="mb-4">Enrolling your keycard...</h2>
          <p>
            Please sign your keycard to continue.
          </p>
        </section>
      </section>
    </section>
  );
}
