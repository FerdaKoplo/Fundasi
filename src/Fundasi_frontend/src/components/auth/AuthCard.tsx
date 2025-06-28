import React, { useEffect, useRef } from "react";
import { useAuth } from "../../context/auth-context";
import LoginButton from "./LoginButton";
import { useNavigate } from "react-router-dom";

const AuthCard: React.FC = () => {
  const { user, isAuthenticated, isLoading, error, login } = useAuth();
  const navigate = useNavigate();
  const hasRedirectedRef = useRef(false);

  const handleLogin = async () => {
    const loggedInUser = await login();
  };

  useEffect(() => {
    if (
      !hasRedirectedRef.current &&
      isAuthenticated &&
      !isLoading &&
      user !== null
    ) {
      const needsProfile = !user.hasProfile;
      console.log("Redirecting based on hasProfile:", needsProfile);
      hasRedirectedRef.current = true;
      navigate(needsProfile ? "/edit-profile" : "/campaigns", {
        replace: true,
      });
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  useEffect(() => {
    console.log("DEBUG: ", { isAuthenticated, isLoading, user });
  }, [isAuthenticated, isLoading, user]);

  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      {!isAuthenticated ? (
        <LoginButton onClick={handleLogin} />
      ) : (
        <div>Welcome, redirecting...</div>
      )}
    </div>
  );
};

export default AuthCard;
