import { Principal } from '@dfinity/principal';
import React from 'react'

interface Review {
  id: string
  comment: string
  user: User
}

interface User {
  id: Principal;
  username: string;
  trustPoints: bigint;
  campaignCount: bigint;
  createdAt: bigint;
  completedCampaigns: bigint;
  avatarUrl?: [string] | []
}

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="space-y-4">
      {reviews.map((rev) => (
        <div
          key={rev.id}
          className="bg-gray-800 rounded-lg p-4 flex flex-col gap-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full black-gradient flex justify-center items-center text-white">
              {rev.user.username[0]?.toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-white">{rev.user.username}</div>
              <div className="text-gray-400 text-sm">
                Trust Points: {rev.user.trustPoints.toString()}
              </div>
            </div>
          </div>
          <div className="text-gray-200">{rev.comment}</div>
        </div>
      ))}
    </div>
  )
}

export default ReviewList