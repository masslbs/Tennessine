const Footer = () => {
  return (
    <footer className="mt-auto md:flex justify-center">
      <div className="mt-3 bg-white p-3 flex justify-center mx-0 rounded-md mx-2 md:mx-0 md:w-full">
        <div className="flex justify-between items-center w-full md:w-[800px]">
          <img
            src="/icons/massmarket-logo.svg"
            alt="logo"
            className="w-[90px] h-[12px] md:w-[120px] md:h-[20px]"
          />
          <div>
            <nav className="space-x-4 flex">
              <a
                href="/privacy-policy"
                className="text-xs"
                style={{ color: "black" }}
              >
                Privacy Policy
              </a>
              <a href="#" className="text-xs" style={{ color: "black" }}>
                Terms & Conditions
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
