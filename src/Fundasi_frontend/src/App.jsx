import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/user/auth/AuthPage";
import AddCampaign from "./pages/user/campaigns/add-campaign";
import DetailCampaign from "./pages/user/campaigns/detail-campaign";
import MicroBusinessList from "./pages/user/campaigns/listcampaign";
import NFTMinting from "./pages/user/campaigns/nft-minting";
import UserProfile from "./pages/user/profile/user-profile";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/add-campaign" element={<AddCampaign />} />
          <Route path="/campaigns" element={<MicroBusinessList />} />
          <Route path="/campaign/:id" element={<DetailCampaign />} />
          <Route
            path="/add-campaign/nft-minting/:id"
            element={<NFTMinting />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
