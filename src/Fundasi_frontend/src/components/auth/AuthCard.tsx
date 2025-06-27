// src/components/auth/AuthCard.tsx
import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { useNavigate } from 'react-router-dom';

const AuthCard: React.FC = () => {
  const { user, isAuthenticated, isLoading, error, login, logout } = useAuth();

  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;


  return (
    <div >
      {!isAuthenticated ? (
        <LoginButton onClick={login} />
      ) : (
        <div>Welcome, redirecting...</div>
      )}
    </div>
  )
}

export default AuthCard;
