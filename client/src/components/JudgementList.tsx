import React from "react";
import JudgmentCard from "@/components/JudgementCard";
import icons from "@/consonants/icons";

const judgmentData = [
  {
    title: "High Court Judgments",
    imageSrc: icons.high_court_judgments,
    link: "https://tshc.gov.in/ehcr/",
  },
  {
    title: "Supreme Court Judgments",
    imageSrc: icons.supreme_court_judgments,
    link: "https://www.sci.gov.in/",
  },
  {
    title: "Other High Court Judgments",
    imageSrc: icons.other_high_court_judgments,
    link: "https://tshc.gov.in/displayListForParent?id=51",
  },
  {
    title: "High Court Judgments in Telugu",
    imageSrc: icons.high_court_judgments_in_telugu,
    link: "https://csis.tshc.gov.in/judgmnt_ts/getjudgmentsTSHC",
  },
  {
    title: "Supreme Court Judgments in Telugu",
    imageSrc: icons.supreme_court_judgments_in_telugu,
    link: "https://csis.tshc.gov.in/judgmnt_ts/getjudgmentsSCI",
  },
];

const JudgmentList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 sm:px-8 lg:px-16 mx-auto">
      {judgmentData.map((item, index) => (
        <JudgmentCard
          key={index}
          title={item.title}
          imageSrc={item.imageSrc}
          link={item.link}
        />
      ))}
    </div>
  );
};

export default JudgmentList;
