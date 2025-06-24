import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useCampaign } from '../../../hooks/useCampaign';

const DetailCampaign = () => {

  const { id } = useParams()
  const { campaign, loading, error, fetchDetailCampaing } = useCampaign()

  useEffect(() => {
    if (id) {
      fetchDetailCampaing(BigInt(id));
    }
  }, [id])



  return (
    <div className="bg-black text-white min-h-screen p-10">
      <h1 className="text-3xl font-bold text-center mb-4">Campaign {campaign?.title}</h1>
      <p className="text-center mb-6">{campaign?.description}</p>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/2">
          {campaign?.media?.imageUrl && campaign.media.imageUrl.length > 0 && (
            <img
              src={campaign.media.imageUrl[0]}
              alt={campaign?.title ?? "Campaign"}
              className="rounded-lg w-full"
            />
          )}
        </div>

        <div className="md:w-1/2 space-y-4">
          <div className="bg-zinc-800 p-4 rounded-lg">
            <div className="flex justify-between">
              <span>{Number(campaign?.stats.upvote)} / {Number(campaign?.milestone)} <span className="text-green-400">NFT</span></span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(100, (Number(campaign?.stats.upvote) / Number(campaign?.milestone)) * 100)}%`
                }}
              />
            </div>
          </div>

          <p>Supporters: {Number(campaign?.stats.upvote ?? 0) + Number(campaign?.stats.devote ?? 0)}</p>
          <p>Trust Scores: {Number(campaign?.owner.trustPoints)}</p>
          <p>Days to go: {Math.max(0, Math.floor((Number(campaign?.endTime) / 1_000_000 - Date.now()) / 1000 / 86400))}</p>

          <button className="black-gradient rounded-full py-3 px-8 font-bold">
            Fund this business
          </button>

          <div className="flex gap-4 mt-4">
            <button className="flex items-center gap-2 text-green-400">
              ✔ Upvote
            </button>
            <button className="flex items-center gap-2 text-red-400">
              ✘ Devote
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailCampaign