import React from "react";
import MicroBusinessList from "./pages/user/campaigns/listcampaign";
import LoginPage from "./pages/user/auth/login-page";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/user/auth/AuthPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/add-campaign" element={<AddCampaign />} />
          <Route path="/campaigns" element={<MicroBusinessList />} />
          <Route path="/campaign/:id"   element={<DetailCampaign />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
