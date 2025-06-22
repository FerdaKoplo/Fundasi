// src/components/auth/AuthCard.tsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

const AuthCard: React.FC = () => {
  const { user, isAuthenticated, isLoading, error, login, logout } = useAuth();

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
        <LoginButton onClick={login} />
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
          <LogoutButton onClick={logout} />
        </div>
      )}
    </div>
  );
};

export default AuthCard;
