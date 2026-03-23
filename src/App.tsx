import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TripDetails from "./pages/TripDetails";
import MuCangChaiTrip from "./pages/MuCangChaiTrip";
import TamChucTrip from "./pages/TamChucTrip";
import MocChauTrip from "./pages/MocChauTrip";
import IdentityModal from "./components/IdentityModal";

function App() {
  return (
    <BrowserRouter>
      <IdentityModal />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* Legacy hardcoded route preserved here */}
        <Route path="/trips/mu-cang-chai" element={<MuCangChaiTrip />} />
        <Route path="/trips/tam-chuc-legacy" element={<TamChucTrip />} />
        <Route path="/trips/moc-chau" element={<MocChauTrip />} />
        {/* Dynamic trip details */}
        <Route path="/trips/:id" element={<TripDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
