import React from 'react';
import { useAuth } from '../hooks/useAuth';

const loginICP: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  } = useAuth();

  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const avatarUrl = user?.avatarUrl?.[0] ?? '/default-avatar.png';
  const principalId = user?.id ? user.id.toText() : 'N/A';
  const trustPoints = user?.trustPoints?.toString() ?? '0';
  const campaignCount = user?.campaignCount?.toString() ?? '0';
  const completedCampaigns = user?.completedCampaigns?.toString() ?? '0';
  const createdAt = user?.createdAt
    ? new Date(Number(user.createdAt) / 1_000_000).toLocaleString()
    : 'N/A';

  return (
    <div className="p-4 border rounded shadow bg-white">
      {!isAuthenticated ? (
        <button
          onClick={login}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login with Internet Identity
        </button>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Welcome, {user?.username ?? 'Unknown'}!
          </h2>
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover mb-2"
          />
          <ul className="text-sm text-gray-700 space-y-1">
            <li><strong>Principal ID:</strong> {principalId}</li>
            <li><strong>Trust Points:</strong> {trustPoints}</li>
            <li><strong>Campaign Count:</strong> {campaignCount}</li>
            <li><strong>Completed Campaigns:</strong> {completedCampaigns}</li>
            <li><strong>Created At:</strong> {createdAt}</li>
          </ul>

          <button
            onClick={logout}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default loginICP;
