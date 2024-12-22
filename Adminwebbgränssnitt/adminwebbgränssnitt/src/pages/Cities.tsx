import CitiesForm from "../components/CitiesForm.tsx";
import authModules from "../../modules/auths.ts";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Cities() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authModules.token) {
      navigate("/login");
    }
  }, []);

  return <CitiesForm />;
}

export default Cities;
