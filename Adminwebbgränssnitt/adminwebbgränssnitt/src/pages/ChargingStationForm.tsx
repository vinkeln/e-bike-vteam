import authModules from "../../modules/auths.ts";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AddChargingStation from "../components/AddChargingStation.tsx";
const ChargingStationForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authModules.token) {
      navigate("/login");
    }
  }, []);
  return <AddChargingStation />;
};

export default ChargingStationForm;
