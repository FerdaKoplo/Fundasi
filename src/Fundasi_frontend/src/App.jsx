import React from "react";
import MicroBusinessList from "./pages/user/campaigns/listcampaign";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DetailCampaign from "./pages/user/campaigns/detail-campaign";
import AuthPage from "./pages/user/auth/AuthPage";
import AddCampaign from "./pages/user/campaigns/add-campaign";
import NFTMinting from "./pages/user/campaigns/nft-minting";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
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
