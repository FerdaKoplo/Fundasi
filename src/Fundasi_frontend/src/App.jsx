import React from "react";
import MicroBusinessList from "./pages/user/campaigns/listcampaign";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DetailCampaign from "./pages/user/campaigns/detail-campaign";
import AuthPage from "./pages/user/auth/AuthPage";
import AddCampaign from "./pages/user/campaigns/add-campaign";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/add-campaign" element={<AddCampaign />} />
          <Route path="/campaigns" element={<MicroBusinessList />} />
          <Route path="/campaign/:id" element={<DetailCampaign />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
