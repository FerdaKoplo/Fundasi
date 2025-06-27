import React, { useState } from "react";
import { HiMiniMegaphone } from "react-icons/hi2";
import Navbar from "../../../components/nav/campaign/nav-menu";
import NavMenuProfile from "../../../components/nav/profile/nav-menu-profile";
import { useAuth } from "../../../hooks/useAuth";
import { FaUser } from "react-icons/fa";
import UserCampaign from "../../../components/detail_profile_pages/user-campaign";
import TrustPointChart from "../../../components/diagram/trust-point-chart";
import NavProfile from "../../../components/nav/profile/nav-profile";
import Button from "../../../components/button/Button";
import { Campaign } from "../../../../../declarations/Fundasi_backend/Fundasi_backend.did";
import { useCampaign } from "../../../hooks/useCampaign";

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState<'about' | 'campaigns' | 'trustpoint' | 'contribution'>('about')
    const { user } = useAuth()
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
    const [isEditMode, setIsEditMode] = useState(false)
    const { fetchDeleteCampaign } = useCampaign()

    const handleDeleteCampaign = async () => {
        if (!selectedCampaign || selectedCampaign.id === undefined) return
        const result = await fetchDeleteCampaign(selectedCampaign?.id)

        if ('ok' in result) {
            alert("Campaign deleted successfully")
            setSelectedCampaign(null)
        } else {
            alert("Failed to delete campaign: " + result.err)
        }
    }

    return (
        <div className="bg-black px-32 ">
            <NavProfile />
            <div className="min-h-screen  text-white flex flex-col items-center ">
                <div className="flex flex-col items-center pt-[30px]">
                    {user?.avatarUrl && user?.avatarUrl.length > 0 ? (
                        <img
                            src={user?.avatarUrl[0]}
                            alt={user?.username}
                            className="w-28 h-28 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-28 h-28 bg-gradient-to-t from-gray-400 to-white  rounded-full flex items-center justify-center text-4xl">
                            <div className='w-24 h-24 bg-black rounded-full flex justify-center items-center'>
                                <FaUser />
                            </div>
                        </div>
                    )}
                    <h1 className="text-2xl font-bold mt-4 ">{user?.username ?? 'Anonymous'}</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        {user?.campaignCount?.toString() ?? '0'} Campaign Project &nbsp;&bull;&nbsp; Joined {user?.createdAt?.toString() ?? '-'} &nbsp;&bull;&nbsp; {user?.trustPoints?.toString() ?? '0'}
                    </p>
                </div>

                <div className="relative mt-2 flex flex-col gap-5 text-base w-screen px-32 p-6">
                    <div className="bottom-10 border-t border-gray-700"></div>
                    <NavMenuProfile activeTab={activeTab} onTabChange={setActiveTab} />
                    {activeTab === 'about' && (
                        <div className="p-10 w-full flex flex-col items-center justify-centers px-4 text-gray-300 text-sm ">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                ut labore et dolore magna aliqua. Ut enim ad minim veniam. Lorem ipsum dolor sit amet,
                                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                            <p className="mt-4">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                ut labore et dolore magna aliqua.
                            </p>
                        </div>
                    )}
                    {activeTab === 'campaigns' && (
                        <div className="p-10 w-full flex flex-col px-4 text-gray-300 text-sm ">
                            <div className="flex items-center justify-between">
                                <Button text={"Create Campaign"} link={"/add-campaign"}></Button>
                                <Button onClick={() => {
                                    setIsEditMode(!isEditMode)
                                    setSelectedCampaign(null)
                                }} text={"Edit Campaign"} link={undefined}></Button>
                            </div>
                            <UserCampaign
                                isEditMode={isEditMode}
                                onCampaignSelect={(campaign) => {
                                    setSelectedCampaign(campaign);
                                }}
                            />
                            {selectedCampaign && isEditMode && (
                                <div className="mt-5 p-4 flex flex-col gap-5  border rounded-lg text-gray-300">
                                    <h3>Selected Campaign: {selectedCampaign.title}</h3>
                                    <div className="flex justify-between items-center">
                                        <Button
                                            text="Edit this campaign"
                                            link={`/edit-campaign/${selectedCampaign.id}`}
                                        />
                                        <Button text={"Delete this campaign"} onClick={() => handleDeleteCampaign()}></Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'trustpoint' && (
                        <div className="p-10 w-full flex flex-col items-center justify-center px-4 text-gray-300 text-sm ">
                            <div className="flex items-center gap-10">
                                <TrustPointChart value={Number(user?.trustPoints ?? BigInt(0))} total={100} />
                                <div className="">
                                    <p className="font-medium text-xl">{Number(user?.trustPoints ?? BigInt(0))} Trust Points</p>
                                    <p className="font-light text-sm">
                                        {Number(user?.trustPoints ?? BigInt(0)) < 50
                                            ? 'Low trust points'
                                            : Number(user?.trustPoints ?? BigInt(0)) < 90
                                                ? 'Mid trust points'
                                                : 'High trust points'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;