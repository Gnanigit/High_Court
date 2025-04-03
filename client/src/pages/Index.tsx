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
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header - fixed at top */}
      <div className="w-full">
        <Header />
      </div>

      {/* Main content area - takes remaining height */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - fixed height, no scrolling */}
        <div
          className={`${
            isCollapsed ? "w-16" : "w-64"
          } flex-shrink-0 transition-all duration-300 overflow-y-auto`}
        >
          <Sidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            setActiveComponent={setActiveComponent}
          />
        </div>

        {/* Dashboard container - allows scrolling only inside dashboard */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <Dashboard activeComponent={activeComponent} />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
