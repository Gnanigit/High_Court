import React from "react";
import JudgmentCard from "@/components/JudgementCard";

const judgmentData = [
  {
    title: "High Court Judgments",
    imageSrc: "/path-to-image/high-court.png",
  },
  {
    title: "Supreme Court Judgments",
    imageSrc: "/path-to-image/supreme-court.png",
  },
  {
    title: "Other High Court Judgments",
    imageSrc: "/path-to-image/other-high-court.png",
  },
  {
    title: "High Court Judgments in Telugu",
    imageSrc: "/path-to-image/high-court-telugu.png",
  },
  {
    title: "Supreme Court Judgments in Telugu",
    imageSrc: "/path-to-image/supreme-court-telugu.png",
  },
];

const JudgmentList: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {judgmentData.map((item, index) => (
        <JudgmentCard key={index} title={item.title} imageSrc={item.imageSrc} />
      ))}
    </div>
  );
};

export default JudgmentList;
