import { useState } from "react";
import { Link } from "@tanstack/react-router";

import ChevronRight from "./common/ChevronRight.tsx";

export default function MassMarketNav() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <section>
      {menuOpen && (
        <span
          className="fixed bg-black w-full h-full opacity-60 z-5"
          onClick={() => {
            menuOpen && setMenuOpen(false);
          }}
        />
      )}
      <section
        className={`bg-white flex justify-center z-10 fixed top-0 left-0 right-0`}
        data-testid="mass-market-nav"
      >
        <section className="relative w-full text-base flex justify-between md:w-[1000px] h-[56px] md:mr-3">
          <div className="flex gap-2 m-2 ml-5 md:ml-0">
            <img
              src={`/icons/mass-labs-logo.svg`}
              width={40}
              height={40}
              alt="mass-labs-logo"
              className="w-10 h-10"
            />
            <h2 className="flex items-center">Mass Market</h2>
          </div>
          <section id="menu-container" className="absolute right-0 flex">
            <div className="w-[50px] flex flex-col items-end">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  backgroundColor: menuOpen ? "#F3F3F3" : "transparent",
                  paddingLeft: 15,
                  paddingRight: 15,
                }}
                type="button"
                className="self-end h-[56px] cursor-pointer"
              >
                <img
                  src={menuOpen
                    ? "/icons/close-icon.svg"
                    : "/icons/hamburger.svg"}
                  width={20}
                  height={20}
                  alt="menu-icon"
                  className="w-5 h-5"
                />
              </button>
              <div
                data-testid="menu-opened"
                className={`${menuOpen ? "z-10 md:min-w-70" : "hidden"}`}
              >
                <div className="bg-background-gray w-screen flex flex-col rounded-b-lg py-4 absolute right-0 md:w-full md:static">
                  <Link to="/support" data-testid="support-link">
                    <div className="flex gap-3 items-center px-6 py-[10px]">
                      <img
                        src={`/icons/menu-settings.svg`}
                        width={20}
                        height={20}
                        alt="menu-item"
                        className="w-5 h-5"
                      />
                      <p className="text-xl text-black whitespace-nowrap">
                        Support
                      </p>
                      <div className="ml-auto w-3 h-3">
                        <ChevronRight />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </section>
      </section>
    </section>
  );
}
