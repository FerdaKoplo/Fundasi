import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCampaign } from "../../../hooks/useCampaign";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import SidebarAbout from "../../../components/sidebar/sidebar-about";
import NavCampaign from "../../../components/nav/campaign/nav-campaign";
import About from "../../../components/detail_campaign_pages/about";
import Author from "../../../components/detail_campaign_pages/author";
import useVotes from "../../../hooks/useVotes";
import { useAuth } from "../../../context/auth-context";
import { Principal } from "@dfinity/principal";
import SidebarReward from "../../../components/sidebar/sidebar-reward";
import Reward from "../../../components/detail_campaign_pages/reward";
import useReview from "../../../hooks/useReview";
import ReviewList from "../../../components/detail_campaign_pages/review/review-list";
import ReviewPost from "../../../components/detail_campaign_pages/review/review-post";

const DetailCampaign = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "campaign" | "author" | "reward" | "reviews"
  >("campaign");
  const { campaign, loading, error, fetchDetailCampaing } = useCampaign();
  const { principalId } = useAuth();
  const { upvote, devote } = useVotes();
  const {
    reviews,
    fetchAllReview,
    loading: reviewLoading,
    error: reviewError,
    postReview,
  } = useReview();
  const [selectedRewardIndex, setSelectedRewardIndex] = useState(0);
  const [selectedAboutIndex, setSelectedAboutIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchDetailCampaing(BigInt(id));
    }
  }, [id]);

  useEffect(() => {
    if (!campaign?.media?.imageUrl) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % campaign.media.imageUrl.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [campaign?.media?.imageUrl]);

  useEffect(() => {
    if (activeTab === "reviews") {
      fetchAllReview();
    }
  }, [activeTab]);

  const handleUpvote = async () => {
    if (!principalId) {
      alert("Please Login First");
      return;
    }

    const userPrincipal = Principal.fromText(principalId);
    await upvote(userPrincipal, BigInt(10));
    alert("sukses memberi upvote!");
  };

  const handleDevote = async () => {
    if (!principalId) {
      alert("Please Login First");
      return;
    }
    const userPrincipal = Principal.fromText(principalId);
    await devote(userPrincipal, BigInt(5));
  };

  const handleSubmitReview = async (comment: string) => {
    await postReview(comment);
    await fetchAllReview();
  };

  return (
    <div className="bg-black space-y-12 px-32 text-white min-h-screen p-10">
      <h1 className="text-3xl font-bold text-center mb-4">
        Campaign {campaign?.title}
      </h1>
      <p className="text-center mb-6">{campaign?.description}</p>
      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/2">
          {campaign?.media?.imageUrl && campaign.media.imageUrl.length > 0 && (
            <div className="relative w-full rounded-lg overflow-hidden">
              <img
                src={campaign.media.imageUrl[currentImageIndex]}
                alt={`${campaign?.title ?? "Campaign"} ${
                  currentImageIndex + 1
                }`}
                className="rounded-lg w-full h-64 object-cover transition-opacity duration-500"
              />
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {campaign.media.imageUrl.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentImageIndex ? "bg-white" : "bg-gray-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:w-1/2 space-y-7">
          <div className="">
            <div className="w-full black-gradient rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (Number(campaign?.stats.upvote) /
                      Number(campaign?.milestone)) *
                      100
                  )}%`,
                }}
              />
              <div className="flex justify-between">
                <span className="font-bold">
                  {Number(campaign?.stats.upvote)} /{" "}
                  {Number(campaign?.milestone)}{" "}
                  <span className="text-emerald-700">NFT</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <p className="font-bold">Supporters</p>
            <p>
              {Number(campaign?.stats.upvote ?? 0) +
                Number(campaign?.stats.devote ?? 0)}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">Trust Scores</p>
            <p>{Number(campaign?.owner.trustPoints)}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">Days to go</p>
            <p>
              {Math.max(
                0,
                Math.floor(
                  (Number(campaign?.endTime) / 1_000_000 - Date.now()) /
                    1000 /
                    86400
                )
              )}
            </p>
          </div>
          <button className="black-gradient rounded-full py-3 px-8 ">
            Fund this business
          </button>

          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-5">
              <div className="rounded-full bg-gradient-to-t p-1 from-green-700 to-green-400">
                <button
                  onClick={handleUpvote}
                  className="flex rounded-full p-2 bg-black text-white items-center gap-2 "
                >
                  <FaCheck />
                </button>
              </div>
              <p className="font-bold">Upvote</p>
            </div>
            <div className="flex items-center gap-5">
              <div className="rounded-full bg-gradient-to-t p-1 from-red-700 to-red-400">
                <button
                  onClick={handleDevote}
                  className="flex rounded-full p-2 bg-black  items-center gap-2 "
                >
                  <ImCross />
                </button>
              </div>
              <p className="font-bold">Upvote</p>
            </div>
          </div>
        </div>
      </div>

      <NavCampaign activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "campaign" && (
        <div className="flex gap-10 mt-8">
          <div className="w-1/4">
            <SidebarAbout
              aboutSections={campaign?.about ?? []}
              selectedIndex={selectedAboutIndex}
              onSelect={setSelectedAboutIndex}
            />
          </div>
          <div className="w-3/4">
            <About aboutSections={campaign?.about ?? []} />
          </div>
        </div>
      )}

      {activeTab === "author" && (
        <div>
          <Author owner={campaign?.owner} />
        </div>
      )}
      {activeTab === "reward" && (
        <div className="flex mt-8 gap-10">
          <div className="w-1/4">
            <SidebarReward
              rewards={campaign?.rewards ?? []}
              selectedIndex={selectedRewardIndex}
              onSelect={setSelectedRewardIndex}
            />
          </div>
          <div className="w-3/4">
            <Reward
              rewards={campaign?.rewards ?? []}
              selectedIndex={selectedRewardIndex}
            />
          </div>
        </div>
      )}
      {activeTab === "reviews" && (
        <div className="w-3/4">
          <ReviewPost
            onSubmit={(comment) => {
              handleSubmitReview(comment);
            }}
          />
          {reviewLoading && <p>Loading reviews...</p>}
          {reviewError && <p className="text-red-500">{reviewError}</p>}
          {reviews.length > 0 ? (
            <ReviewList reviews={reviews} />
          ) : (
            <p className="text-gray-400">
              No reviews yet. Be the first to review!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailCampaign;
