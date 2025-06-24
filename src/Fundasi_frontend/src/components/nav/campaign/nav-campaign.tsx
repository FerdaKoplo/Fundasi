import React from 'react'

interface NavCampaignProps {
  activeTab: string
  onTabChange: (tab: 'campaign' | 'author' | 'reward' | 'reviews') => void
}

const NavCampaign: React.FC<NavCampaignProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav>
      <ul className='flex items-center justify-center space-x-8 cursor-pointer'>
        <li className={activeTab === 'campaign' ? 'font-bold green-gradient' : ''} onClick={() => onTabChange('campaign')}>
            Campaign
        </li>
        <li className={activeTab === 'author' ? 'font-bold green-gradient' : ''} onClick={() => onTabChange('author')}>
            Author
        </li>
        <li className={activeTab === 'reward' ? 'font-bold green-gradient' : ''} onClick={() => onTabChange('reward')}>
            Reward
        </li>
        <li className={activeTab === 'reviews' ? 'font-bold green-gradient' : ''} onClick={() => onTabChange('reviews')}>
            Reviews
        </li>
      </ul>
    </nav>
  )
}

export default NavCampaign
