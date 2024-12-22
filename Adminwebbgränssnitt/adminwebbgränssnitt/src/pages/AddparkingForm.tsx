import AddParking from "../components/AddParking";
import authModules from "../../modules/auths.ts";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AddparkingForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authModules.token) {
      navigate("/login");
    }
  }, []);
  return <AddParking />;
};

export default AddparkingForm;
