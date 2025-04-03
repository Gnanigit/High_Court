import React from "react";
import JudgmentList from "@/components/JudgementList";
import Documents from "@/components/Documents";

interface DashboardProps {
  activeComponent: string;
}

const Dashboard: React.FC<DashboardProps> = ({ activeComponent }) => {
  console.log(activeComponent);
  return (
    <div className="p-6">
      {activeComponent === "JudgmentList" && <JudgmentList />}
      {activeComponent === "Documents" && <Documents />}
    </div>
  );
};

export default Dashboard;
