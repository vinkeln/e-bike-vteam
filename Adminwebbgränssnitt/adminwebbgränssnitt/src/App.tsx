import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ChargingStationsMap from "./pages/mapRender";
import UserManagement from "./pages/customers";
import Cities from "./pages/Cities";
import { AddCityForm } from "./pages/AddCityForm";
import AddParking from "./components/AddParking";
import ChargingStationForm from "./pages/ChargingStationForm";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mapRender" element={<ChargingStationsMap />} />
        <Route path="/customers" element={<UserManagement />} />
        <Route path="/addcity" element={<AddCityForm />} />
        <Route path="/addparking" element={<AddParking />} />
        <Route path="/addstation" element={<ChargingStationForm />} />
      </Routes>
    </>
  );
}

export default App;
