import React from 'react'

interface NavMenuProfileProps {
  activeTab: string
  onTabChange: (tab: 'about' | 'campaigns' | 'trustpoint' | 'contribution' ) => void
}

const NavMenuProfile: React.FC<NavMenuProfileProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav>
      <ul className='flex items-center justify-center space-x-8 cursor-pointer'>
        <li className={activeTab === 'about' ? 'font-bold green-gradient' : ''} onClick={() => onTabChange('about')}>
            About
        </li>
        <li className={activeTab === 'campaigns' ? 'font-bold green-gradient' : ''} onClick={() => onTabChange('campaigns')}>
            Campaign
        </li>
        <li className={activeTab === 'trustpoint' ? 'font-bold green-gradient' : ''} onClick={() => onTabChange('trustpoint')}>
            Trust Point
        </li>
        <li className={activeTab === 'contribution' ? 'font-bold green-gradient' : ''} onClick={() => onTabChange('contribution')}>
            Contribution
        </li>
      </ul>
    </nav>
  )
}

export default NavMenuProfile
