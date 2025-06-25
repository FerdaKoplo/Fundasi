import React from "react";

interface AboutCampaign {
  titleAbout: [string] | [];
  content: [string] | [];
  section: [string] | [];
  imageUrl: string[];
}

interface SideBarAboutProps {
  aboutSections: AboutCampaign[];
}

const SideBarAbout: React.FC<SideBarAboutProps> = ({ aboutSections }) => {
  return (
    <nav>
      {aboutSections?.map((aboutItem, index) => {
        const title = aboutItem.titleAbout?.[0] ?? "";
        const section = aboutItem.section?.[0] ?? "";
        if (!title || !section) return null;

        return (
          <a
            key={index}
            href={`#${section}`}
            className="text-white block py-1 hover:underline"
          >
            {title}
          </a>
        );
      })}
    </nav>
  );
};

export default SideBarAbout;
