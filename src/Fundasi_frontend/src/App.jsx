import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import AuthPage from "./pages/user/auth/AuthPage";
import AddCampaign from "./pages/user/campaigns/add-campaign";
import DetailCampaign from "./pages/user/campaigns/detail-campaign";
import MicroBusinessList from "./pages/user/campaigns/listcampaign";
import NFTMinting from "./pages/user/campaigns/nft-minting";
import UserProfile from "./pages/user/profile/user-profile";
import UpdateCampaign from "./pages/user/campaigns/update-campaign";
import MainLanding from "./pages/landing/main-landing";

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <p>Loading...</p>

  return (
    <Routes>
      <Route path="/" element={<MainLanding />}/>
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/user-profile"
        element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/add-campaign"
        element={isAuthenticated ? <AddCampaign /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/edit-campaign/:id"
        element={isAuthenticated ? <UpdateCampaign /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/campaigns"
        element={isAuthenticated ? <MicroBusinessList /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/campaign/:id"
        element={isAuthenticated ? <DetailCampaign /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/add-campaign/nft-minting/:id"
        element={isAuthenticated ? <NFTMinting /> : <Navigate to="/login" replace />}
      />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App
