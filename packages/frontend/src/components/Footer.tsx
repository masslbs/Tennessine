const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-auto py-4">
      <div className="container mx-auto px-2">
        <div className="flex justify-between items-center">
          <img
            src="/icons/massmarket-logo.svg"
            alt="logo"
            className="w-[90px] h-[12px] md:w-[120px] md:h-[20px]"
          />
          <div>
            <nav className="space-x-4">
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
