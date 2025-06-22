import React, { useState } from 'react'
import { useCampaign } from '../../../hooks/useCampaign'
import { Principal } from '@dfinity/principal'

const AddCampaign = () => {

  const { fetchAddCampaign, loading, error } = useCampaign()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [milestone, setMilestone] = useState('');
  const [media, setMedia] = useState<{ imageUrl: [] | [string] }>({ imageUrl: [] })
  const [aboutSections, setAboutSections] = useState([
    { titleAbout: '', content: '', section: '' },
  ])
  const [rewards, setRewards] = useState([
    { level: '', quantity: '', description: '', estimatedDelivery: '' },
  ])

  const handleAddAbout = () => {
    setAboutSections([
      ...aboutSections,
      { titleAbout: '', content: '', section: '' },
    ])
  }
  const handleAddReward = () => {
    setRewards([
      ...rewards,
      { level: '', quantity: '', description: '', estimatedDelivery: '' },
    ])
  }

  const handleAboutChange = (index: number, field: string, value: string) => {
    const updated = [...aboutSections];
    (updated[index] as any)[field] = value;
    setAboutSections(updated)
  };

  const handleRewardChange = (index: number, field: string, value: string) => {
    const updated = [...rewards];
    (updated[index] as any)[field] = value;
    setRewards(updated)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setMedia({ imageUrl: [] });
      return
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMedia({ imageUrl: [reader.result as string] })
    };
    reader.readAsDataURL(file);
  }

  const handleAddCampaign = async () => {
    const campaignData = {
      title: title || '',
      description: description || '',
      milestone: BigInt(parseInt(milestone) || 100),
      owner: {
        id: Principal.fromText('aaaaa-aa'),
        username: 'test-user',
        trustPoints: BigInt(0),
        campaignCount: BigInt(0),
        completedCampaigns: BigInt(0),
        createdAt: BigInt(Date.now()),
        avatarUrl: [] as []
      },
      stats: {
        upvote: BigInt(0),
        devote: BigInt(0)
      },
      media: media,
      rewards: rewards.map((r) => {
        return {
          level: r.level,
          quantity: BigInt(parseInt(r.quantity) || 0),
          description: r.description,
          estimatedDelivery: r.estimatedDelivery
            ? [r.estimatedDelivery] as [string]
            : [] as [],
          imageUrl: [] as []
        }
      }),
      about: aboutSections.map((a) => {
        return {
          titleAbout: a.titleAbout ? [a.titleAbout] as [string] : [] as [],
          content: a.content ? [a.content] as [string] : [] as [],
          section: a.section ? [a.section] as [string] : [] as []
        };
      }),
      review: [] as []
    }

    const result = await fetchAddCampaign(campaignData)
    console.log(result)
  }

  return (
    <div className='bg-black '>
      <div className='px-32 flex min-h-screen flex-col gap-10  justify-center items-center'>
        <form
          onSubmit={handleAddCampaign}
          className="max-w-4xl mx-auto rounded-xl p-8 space-y-8"
        >
          <h1 className="text-3xl font-bold text-white text-center">Add Campaign</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Campaign Details */}
            <div className="bg-gradient-to-l p-2 rounded-lg ">
              <div className='space-y-4 bg-black p-4 rounded-lg'>
                <h3 className="text-green-300 font-bold text-xl">Campaign Details</h3>
                <input className="black-gradient  text-gray-100 rounded-lg p-3 w-full" value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)}/>
                <textarea className="black-gradient  text-gray-100 rounded-lg p-3 w-full" value={description} placeholder="Description" onChange={(e) => setDescription(e.target.value)}/>
                <input className="black-gradient  text-gray-100 rounded-lg p-3 w-full" accept="image/*" type="file" onChange={handleImageChange} />
                <input
                  className="black-gradient text-gray-100 rounded-lg p-3 w-full"
                  placeholder="Milestone (e.g., Max NFT quantity)"
                  value={milestone}
                  onChange={(e) => setMilestone(e.target.value)}
                  type="number"
                />
                {media.imageUrl[0] && (
                  <img
                    src={media.imageUrl[0]}
                    alt="Campaign Preview"
                    className="w-48 rounded-lg mt-3"
                  />
                )}
              </div>
            </div>

            {/* Right: About + Rewards */}
            <div className="bg-gradient-to-r from-black to-green-950 p-2 rounded-lg space-y-6">
              <div className='bg-black p-4 rounded-lg'>
                <h3 className="text-green-300 font-bold text-xl">About Sections</h3>
                {aboutSections.map((a, index) => (
                  <div key={index} className="space-y-2 mt-3">
                    <input className="black-gradient  text-gray-100 rounded-lg p-3 w-full" value={a.titleAbout} placeholder="Title" onChange={(e) => handleAboutChange(index, 'titleAbout', e.target.value)} />
                    <input className="black-gradient  text-gray-100 rounded-lg p-3 w-full" value={a.content} placeholder="Content" onChange={(e) => handleAboutChange(index, 'content', e.target.value)} />
                    <input className="black-gradient  text-gray-100 rounded-lg p-3 w-full" value={a.section}
                      placeholder="Section" onChange={(e) => handleAboutChange(index, 'section', e.target.value)} />
                  </div>
                ))}
                <button className="text-gray-300 hover:text-white mt-2" type="button" onClick={handleAddAbout}>
                  + Add Another About Section
                </button>
              </div>

              <div className='bg-black p-2 rounded-lg'>
                <h3 className="text-green-300 font-bold text-xl">Rewards</h3>
                {rewards.map((r, index) => (
                  <div key={index} className="space-y-2 mt-3 ">
                    <input className="black-gradient  text-gray-100 rounded-lg p-3 w-full" placeholder="Level" value={r.level}
                      onChange={(e) => handleRewardChange(index, 'level', e.target.value)} />
                    <input className="black-gradient  text-gray-100 rounded-lg p-3 w-full" placeholder="Quantity" value={r.quantity}
                      onChange={(e) => handleRewardChange(index, 'quantity', e.target.value)} />
                    <input className="black-gradient  text-gray-100 rounded-lg p-3 w-full" placeholder="Description" value={r.description}
                      onChange={(e) => handleRewardChange(index, 'description', e.target.value)} />
                    <input className="black-gradient  text-gray-100 rounded-lg p-3 w-full" placeholder="Estimated Delivery" value={r.estimatedDelivery}
                      onChange={(e) => handleRewardChange(index, 'estimatedDelivery', e.target.value)} />
                  </div>
                ))}
                <button className="text-gray-300 hover:text-white mt-2" type="button" onClick={handleAddReward}>
                  + Add Another Reward
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              disabled={loading}
              className="black-gradient rounded-full py-3 px-8 text-white font-bold hover:opacity-90 disabled:opacity-50"
              type="submit"
            >
              {loading ? 'Adding...' : 'Add Campaign'}
            </button>
          </div>

          {error && (
            <div className="bg-red-600 text-white p-3 rounded mt-4 text-center">
              {error}
            </div>
          )}
        </form>

      </div>
    </div>
  )
}

export default AddCampaign