import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from './rubik-rubik-svgrepo-com.svg'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className="bg-[#a41830] fixed top-3 left-3 right-3 rounded-lg  z-50">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-1 md:flex md:items-center md:gap-12">
              <Link className="block text-white" to="/">
                <span className="sr-only">Home</span>
                <div className="flex items-center gap-4"> {/* Flex container for logo */}
              <Logo className="h-8" /> {/* Use the Logo component */}
            </div>
              </Link>
            </div>

            <div className="md:flex md:items-center md:gap-12">
              <nav aria-label="Global" className="hidden md:block">
                <ul className="flex items-center gap-6 text-md">
                  <li>
                    <Link className="text-white  transition hover:text-gray-200" to="/">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link className="text-white transition hover:text-gray-200" to="/suduko">
                      Suduko
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className="flex items-center gap-4">
                {/* <div className="sm:flex sm:gap-4">
                  <Link
                    className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-[#a71930] shadow"
                    to="/login"
                  >
                    Login
                  </Link>
                </div> */}

                <div className="block md:hidden relative">
                  <button
                    className="rounded bg-white p-2 text-[#a71930] transition hover:text-[#a71930]/75"
                    onClick={toggleMenu}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg z-40">
                      <ul className="flex flex-col p-2">
                        <li>
                          <Link className="block text-[#a71930] py-2 px-4 hover:bg-gray-100" to="/">
                            Home
                          </Link>
                          <Link className="block text-[#a71930] py-2 px-4 hover:bg-gray-100" to="/suduko">
                            Suduko
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;



