import React from "react";

interface JudgmentCardProps {
  title: string;
  imageSrc: string;
}

const JudgmentCard: React.FC<JudgmentCardProps> = ({ title, imageSrc }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md flex flex-col items-center w-64">
      <img src={imageSrc} alt={title} className="w-16 h-16 mb-2" />
      <p className="text-center font-semibold">{title}</p>
    </div>
  );
};

export default JudgmentCard;
