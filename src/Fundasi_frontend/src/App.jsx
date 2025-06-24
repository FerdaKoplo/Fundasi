import AddCampaign from "./pages/user/campaigns/add-campaign";

import React from "react";
import MicroBusinessList from "./pages/user/campaigns/listcampaign";
import LoginPage from "./pages/user/auth/login-page";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/add-campaign" element={<AddCampaign />} />
          <Route path="/campaigns" element={<MicroBusinessList />} />
          <Route path="/campaign/:ownerId"   element={<MicroBusinessList />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
