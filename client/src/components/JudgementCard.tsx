import React from "react";

interface JudgmentCardProps {
  title: string;
  imageSrc: string;
}

const JudgmentCard: React.FC<JudgmentCardProps> = ({ title, imageSrc }) => {
  return (
    <div className="border border-primary_head rounded-lg p-4 shadow-md shadow-primary_head-shadow flex flex-col items-center w-80 h-48 justify-center hover:cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105">
      <img src={imageSrc} alt={title} className="w-16 h-16 mb-2" />
      <p className="text-center font-semibold">{title}</p>
    </div>
  );
};

export default JudgmentCard;
