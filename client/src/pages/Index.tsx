import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeComponent, setActiveComponent] =
    useState<string>("JudgmentList");

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="sticky top-0 left-0 right-0 w-full z-10">
        <Header />
      </div>

      <div className="flex flex-1">
        <div
          className={`${
            isCollapsed ? "w-16" : "w-64"
          } h-screen flex-shrink-0 transition-all duration-300`}
        >
          <Sidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            setActiveComponent={setActiveComponent}
          />
        </div>

        <div className="flex flex-col w-full h-screen">
          <div className="flex-1 overflow-y-auto p-6">
            <Dashboard activeComponent={activeComponent} />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Index;
