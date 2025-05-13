import BackButton from "./common/BackButton.tsx";

export default function Contact() {
  return (
    <main className="px-4 flex justify-center">
      <section className="md:w-[800px] w-full">
        <BackButton />
        <h1 className="py-3">Contact</h1>
        <section className="mt-2 flex flex-col gap-1 bg-white p-5 rounded-lg">
          <p>
            If you wish to contact the shop with questions about products or
            shipping please use the details below:
          </p>
          <h3>Email</h3>
          <p>info@mass.market</p>
        </section>
      </section>
    </main>
  );
}
