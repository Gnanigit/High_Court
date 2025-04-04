import React from "react";
import { Link } from "react-router-dom";

interface JudgmentCardProps {
  title: string;
  imageSrc: string;
  link: string;
}

const JudgmentCard: React.FC<JudgmentCardProps> = ({
  title,
  imageSrc,
  link,
}) => {
  return (
    <Link to={link} className="no-underline" target="_blank">
      <div className="border border-primary_head rounded-lg p-4 shadow-md shadow-primary_head-shadow flex flex-col items-center justify-center w-full max-w-sm h-48 hover:cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105">
        <img
          src={imageSrc}
          alt={title}
          className="w-16 h-16 mb-2 object-contain"
        />
        <p className="text-center font-semibold text-sm sm:text-base">
          {title}
        </p>
      </div>
    </Link>
  );
};

export default JudgmentCard;
