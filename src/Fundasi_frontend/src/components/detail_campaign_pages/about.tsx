import React from 'react'

interface AboutProps {
  aboutSections: {
    titleAbout: string[]
    content: string[]
    section: string[]
    imageUrl: string[]
  }[]
}

const About: React.FC<AboutProps> = ({ aboutSections }) => {
  return (
    <div className="flex flex-col space-y-10">
      {aboutSections.map((aboutItem, index) => {
        const title = aboutItem.titleAbout?.[0] ?? ''
        const content = aboutItem.content?.[0] ?? ''
        const section = aboutItem.section?.[0] ?? ''
        const images = aboutItem.imageUrl ?? []
        return (
          <div key={index} id={section}>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-3">{content}</p>
            <div className="flex space-x-3 mt-3">
              {images.map((imgUrl, i) => (
                <img key={i} src={imgUrl} alt={title} className="w-48 rounded" />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default About
