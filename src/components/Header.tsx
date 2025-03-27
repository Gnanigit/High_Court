import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-full flex-row items-center justify-between p-4 bg-white border-b sm:px-6 animate-fade-in">
      <div className="w-full justify-between flex items-center space-x-4 mb-7">
        <div className=" flex items-center space-x-4">
          <img
            src="/logo.jpg"
            alt="Telangana High Court Logo"
            className="w-20"
          />
          <div>
            <h1 className="text-3xl font-bold text-primary_head">HIGH COURT</h1>
            <p className="text-sm text-gray-700">FOR THE STATE OF TELANGANA</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-2"></div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-2 animate-slide-down mb-5">
            Translate Judgements
            <span className="text-primary_head"> Effortlessly</span>
          </h1>
          <h1 className="text-2xl sm:text-4xl md:text-4xl font-semibold tracking-tight mb-2 animate-slide-down">
            తీర్పులను సులభంగా
            <span className="text-primary_head"> అనువదించండి</span>
          </h1>
        </div>
        <div className="items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search.."
              className="border rounded-md px-3 py-2 pr-10 text-sm"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
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
    </header>
  );
};

export default Header;
