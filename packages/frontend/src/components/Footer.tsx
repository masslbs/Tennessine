const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-auto py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <img
              src="/icons/massmarket-logo.svg"
              alt="logo"
              width={125}
              height={20}
            />
          </div>
          <div>
            {
              /* <nav className="space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Terms & Conditions</a>
            </nav> */
            }
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
