import React from "react";
import MicroBusinessList from "./pages/user/campaigns/listcampaign";
import loginICP from "./components/loginICP";

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
