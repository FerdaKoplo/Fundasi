import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/auth-context";
import AuthPage from "./pages/user/auth/AuthPage";
import AddCampaign from "./pages/user/campaigns/add-campaign";
import DetailCampaign from "./pages/user/campaigns/detail-campaign";
import MicroBusinessList from "./pages/user/campaigns/listcampaign";
import NFTMinting from "./pages/user/campaigns/nft-minting";
import UserProfile from "./pages/user/profile/user-profile";
import UpdateCampaign from "./pages/user/campaigns/update-campaign";
import EditProfile from "./pages/user/profile/edit-profile";
import { AuthProvider } from "./context/auth-context";

function AppRoutes() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate
              to={user?.hasProfile ? "/campaigns" : "/edit-profile"}
              replace
            />
          ) : (
            <AuthPage />
          )
        }
      />

      <Route
        path="/user-profile"
        element={
          isAuthenticated ? <UserProfile /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/add-campaign"
        element={
          isAuthenticated ? <AddCampaign /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/edit-profile"
        element={
          isAuthenticated ? <EditProfile /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/edit-campaign/:id"
        element={
          isAuthenticated ? (
            <UpdateCampaign />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/campaigns"
        element={
          isAuthenticated ? (
            <MicroBusinessList />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/campaign/:id"
        element={
          isAuthenticated ? (
            <DetailCampaign />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/add-campaign/nft-minting/:id"
        element={
          isAuthenticated ? <NFTMinting /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
