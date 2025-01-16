import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ChargingStationsMap from "./pages/mapRender";
import Customers from "./pages/Customers";
import Cities from "./pages/Cities";
import { AddCityForm } from "./pages/AddCityForm";
import AddParking from "./components/AddParking";
import ChargingStationForm from "./pages/ChargingStationForm";
import UserTravelsPage from "./pages/UserTravelsPage";
import SocketTest from "./pages/SocketTest";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ChargingStationsMap />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/mapRender" element={<ChargingStationsMap />} /> */}
        <Route path="/customers" element={<Customers />} />
        <Route path="/addcity" element={<AddCityForm />} />
        <Route path="/addparking" element={<AddParking />} />
        <Route path="/addstation" element={<ChargingStationForm />} />
        <Route path="/user-travels/:userId" element={<UserTravelsPage />} />
        <Route path="/sockettest" element={<SocketTest />} />
      </Routes>
    </>
  );
}

export default App;