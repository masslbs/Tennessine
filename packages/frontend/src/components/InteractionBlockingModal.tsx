interface InteractionModalProps {
  children: React.ReactNode;
  description: React.ReactNode;
  title: string;
  errorMessage: string;
}
export function InteractionBlockingModal(
  { children, title, description, errorMessage }: InteractionModalProps,
) {
  return (
    <>
      <section className="w-full h-full absolute z-1000">
        <section
          className="rounded-sm min-h-[10rem] max-w-[30ch] md:max-w-[47ch] bg-zinc-700 ml-auto mr-auto mt-16 p-4 text-white"
          style={{
            boxShadow: "#212121 4px 4px 2px",
          }}
        >
          <h2 className="mb-4">{title}</h2>
          {description}
          <p className="font-mono text-xs mt-6">{errorMessage}</p>
        </section>
      </section>
      <section className="pointer-events-none blur-sm">
        {children}
      </section>
    </>
  );
}
