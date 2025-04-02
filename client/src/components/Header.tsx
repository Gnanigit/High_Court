import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [showTranslateDropdown, setShowTranslateDropdown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowTranslateDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowTranslateDropdown(false);
    }, 300); // 300ms delay before hiding the dropdown
  };

  return (
    <header className="w-full flex-row items-center justify-between bg-white border-b animate-fade-in">
      <div className="w-full justify-between flex items-center space-x-4 mb-3 p-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-4 cursor-pointer">
            <img
              src="/logo.png"
              alt="Telangana High Court Logo"
              className="w-20"
            />
            <div>
              <h1 className="text-3xl font-bold text-primary_head">
                HIGH COURT
              </h1>
              <p className="text-sm font-bold text-gray-700">
                FOR THE STATE OF TELANGANA
              </p>
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-2"></div>
          <h1 className="font-md text-3xl font-bold tracking-tight animate-slide-down mb-5">
            Translate Judgements
            <span className="text-primary_head"> Effortlessly</span>
          </h1>
          <h1 className="font-md text-2xl font-semibold tracking-tight mb-2 animate-slide-down">
            తీర్పులను సులభంగా
            <span className="text-primary_head"> అనువాదించండి</span>
          </h1>
        </div>
        <div className="items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search.."
              className="border border-gray-300 rounded-md px-3 py-3 pr-10 text-sm w-[250px] focus:border-primary_head focus:outline-none focus:ring-1 focus:ring-primary_head"
            />

            <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 hover:text-primary_head"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <nav className="bg-primary_head text-white p-3 flex items-center justify-center w-full">
        <ul className="flex space-x-6 text-md font-medium">
          <li className="hover:underline cursor-pointer">
            <Link to="/">Home</Link>
          </li>
          <li
            className="relative hover:underline cursor-pointer group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/translate/single">Translate to Telugu</Link>

            {showTranslateDropdown && (
              <div
                className="absolute left-0 top-full pt-2 z-20"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-56 rounded-md overflow-hidden backdrop-blur-md bg-white/70 border border-white/30 shadow-lg">
                  <div className="py-1">
                    <Link
                      to="/translate/single"
                      className="block px-4 py-3 text-sm text-gray-800 hover:bg-white/60 transition duration-150"
                    >
                      Upload Single Document
                    </Link>
                    <Link
                      to="/translate/multiple"
                      className="block px-4 py-3 text-sm text-gray-800 hover:bg-white/60 transition duration-150"
                    >
                      Upload Multiple Documents
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </li>
          <li className="hover:underline cursor-pointer">
            <Link to="/services">Services</Link>
          </li>
          <li className="hover:underline cursor-pointer">
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
