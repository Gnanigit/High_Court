import React, { useState } from "react";
import images from "@/consonants/images";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  setActiveComponent: (component: string) => void;
}

interface MenuItem {
  name: string;
  icon: string;
  component: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  setActiveComponent,
}) => {
  const [activeItem, setActiveItem] = useState<string>("Document Library");

  const menuItems: MenuItem[] = [
    {
      name: "E-Services",
      icon: "M3 10h18M3 14h18M5 6h14M7 18h10M10 21h4",
      component: "Documents",
    },
    {
      name: "Recruitment",
      icon: "M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-6 9v-2a6 6 0 0112 0v2",
      component: "Documents",
    },
    {
      name: "District Judiciary",
      icon: "M12 3l8 6-8 6-8-6 8-6zm0 9v9",
      component: "Documents",
    },
    {
      name: "Documents",
      icon: "M6 2H14L20 8V20A2 2 0 0 1 18 22H6A2 2 0 0 1 4 20V4A2 2 0 0 1 6 2Z M14 2V8H20",
      component: "Documents",
    },

    {
      name: "Tenders",
      icon: "M3 7h18M3 12h18M3 17h18",
      component: "Documents",
    },
  ];

  return (
    <div
      className={`bg-primary text-gray flex flex-col justify-between transition-all duration-300 w-full h-full ${
        !isCollapsed && "px-3"
      } pt-10`}
    >
      <div
        className={`flex items-center rounded-lg w-full h-12 ${
          isCollapsed ? "justify-center" : "gap-x-3 px-3 bg-secondary-100"
        }`}
      >
        <img
          src={images.profile}
          className="w-6 h-6 rounded-full"
          alt="Profile"
        />
        {!isCollapsed && (
          <p className="text-black font-semibold">Account Name</p>
        )}
      </div>

      <nav className="flex-1 mt-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => {
                  setActiveItem(item.name);
                  setActiveComponent(item.component);
                }}
                className={`flex items-center px-4 py-3 rounded-lg font-semibold text-base transition-colors ${
                  activeItem === item.name
                    ? "border-l-4 border-primary_head bg-secondary text-black"
                    : "text-gray"
                } hover:text-black ${isCollapsed ? "justify-center" : ""}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={item.icon}
                  ></path>
                </svg>
                {!isCollapsed && <span className="ml-3">{item.name}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto p-4 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-x-3">
            <div className="w-6 h-6 bg-secondary rounded-full"></div>
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-gray-400">Administrator</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-8 h-8 text-black rounded-full flex items-center justify-center transition-all duration-700 ease-in-out"
        >
          {isCollapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
