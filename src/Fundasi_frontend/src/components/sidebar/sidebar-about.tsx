import React from "react";
import { FaChevronRight } from "react-icons/fa";

interface AboutCampaign {
  titleAbout: [string] | [];
  content: [string] | [];
  section: [string] | [];
  imageUrl: string[];
}

interface SideBarAboutProps {
  aboutSections: AboutCampaign[]
  selectedIndex: number;
  onSelect: (index: number) => void
}

const SideBarAbout: React.FC<SideBarAboutProps> = ({  aboutSections,
  selectedIndex,
  onSelect, }) => {
  return (
    <nav className="space-y-3">
      {aboutSections?.map((aboutItem, index) => {
        const title = aboutItem.titleAbout?.[0] ?? ""; 
        const section = aboutItem.section?.[0] ?? ""; 
        if (!title || !section) return null;

        return (
          <div
            key={index}
            onClick={() => onSelect(index)}
            className={`p-3 cursor-pointer rounded-lg transition ${
              selectedIndex === index
                ? "bg-gray-900 border border-green-500"
                : "hover:bg-gray-800"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">{title}</span>
              {selectedIndex === index && (
                <FaChevronRight className="text-green-400" />
              )}
            </div>
          </div>
        );
      })}
    </nav>
  );
};

export default SideBarAbout;