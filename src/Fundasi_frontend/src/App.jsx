import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/user/auth/AuthPage";
import AddCampaign from "./pages/user/campaigns/add-campaign";
import DetailCampaign from "./pages/user/campaigns/detail-campaign";
import MicroBusinessList from "./pages/user/campaigns/listcampaign";

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
