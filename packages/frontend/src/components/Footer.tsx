const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-auto py-4 md:flex justify-center">
      <div className="container px-2 flex justify-center mx-0">
        <div className="flex justify-between items-center w-full md:w-[800px]">
          <img
            src="/icons/massmarket-logo.svg"
            alt="logo"
            className="w-[90px] h-[12px] md:w-[120px] md:h-[20px]"
          />
          <div>
            <nav className="space-x-4 flex">
              <a href="#" className="text-xs text-black">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-black">
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
