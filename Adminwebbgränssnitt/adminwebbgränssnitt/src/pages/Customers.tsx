import authModules from "../../modules/auths.ts";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomersTable from "../components/CustomersTable.tsx";

const Customers = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authModules.token) {
      navigate("/login");
    }
  }, []);

  return <CustomersTable />;
};

export default Customers;
