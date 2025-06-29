import { Principal } from '@dfinity/principal';
import React from 'react'
import { FaUser } from 'react-icons/fa';

interface Owner {
    id: Principal;
    username: string;
    trustPoints: bigint;
    campaignCount: bigint;
    createdAt: bigint;
    completedCampaigns: bigint;
    avatarUrl?: [string] | []
}

interface AuthorProps {
    owner?: Owner;
}
const Author: React.FC<AuthorProps> = ({ owner }) => {
    if (!owner) {
        return <div className="text-gray-400">No author information available</div>
    }

    const createdDate = new Date(Number(owner.createdAt) / 1_000_000).toLocaleDateString()

    return (
        <div className="bg-black rounded-lg p-4 space-y-8">
            <h1 className='font-bold '>About the Creator</h1>
            <div className="flex items-center space-x-4">
                {owner.avatarUrl && owner.avatarUrl.length > 0 ? (
                    <img
                        src={owner.avatarUrl[0]}
                        alt={owner.username}
                        className="w-28 h-28 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-28 h-28 rounded-full bg-gradient-to-t from-gray-400 to-white  flex items-center justify-center text-xl font-bold">
                        <div className='bg-black w-24 h-24 flex items-center justify-center rounded-full'>
                            <FaUser />
                        </div>
                    </div>
                )}
                <div>
                    <h2 className="text-xl font-bold">{owner.username}</h2>
                    <p className="text-gray-400">@{owner.id.toString()}</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-5  text-gray-300">
                <div className='flex flex-col'>
                    <div className='flex items-center text-xl font-bold gap-5'>
                        <span>{Number(owner.campaignCount)}</span>
                        <p className="font-semibold">Campaigns Created</p>
                    </div>
                    <div className='flex font-semibold items-center gap-5'>
                        <span>{Number(owner.completedCampaigns)}</span>
                        <p className="">Completed Campaigns</p>
                    </div>
                </div>
                <div className='flex items-center text-xl font-bold  gap-5'>
                    <span>{Number(owner.trustPoints)}</span>
                    <p className="font-semibold">Trust Points</p>
                </div>
                <div className='flex flex-col'>
                    <span className='text-xl font-bold'>{createdDate}</span>
                    <p className="font-semibold">Joined At</p>
                </div>
            </div>
        </div>
    )
}

export default Author
