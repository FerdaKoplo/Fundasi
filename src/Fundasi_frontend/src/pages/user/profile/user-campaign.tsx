import React from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { useCampaign } from '../../../hooks/useCampaign'

const UserCampaign = () => {
    
    const {} = useAuth()
    const {} = useCampaign()
    
    
    return (
        <div>
            <div className="flex flex-col items-center pt-[30px]">
                <div className="w-28 h-28 bg-gray-700 rounded-full flex items-center justify-center text-4xl">
                    👤
                </div>
                <h1 className="text-2xl font-bold mt-4">{user.name}</h1>
                <p className="text-sm text-gray-400 mt-1">
                    {user.projects} Campaign Project &nbsp;&bull;&nbsp; Joined {user.joined} &nbsp;&bull;&nbsp; {user.status}
                </p>
            </div>
        </div>
    )
}

export default UserCampaign