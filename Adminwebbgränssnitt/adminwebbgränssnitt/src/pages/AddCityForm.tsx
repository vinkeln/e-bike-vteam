import AddCity from "../components/AddCity";
import citiesModules from "../../modules/citises.ts";
import Alert from "../components/Alert.tsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authModules from "../../modules/auths.ts";

export const AddCityForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authModules.token) {
      navigate("/login");
    }
  }, []);

  const [checkResult, setCheckResult] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");
  const handleFormSubmit = async (values: {
    name: string;
    country: string;
  }) => {
    try {
      const result = await citiesModules.addCity(values.name, values.country);
      if (result === "ok") {
        navigate("/cities"); // Navigera till hemsidan efter lyckad inloggning
        setCheckResult(true);
        setColor("alert-success");
        setMessage("City has been added");
      } else {
        setCheckResult(true);
        setColor("alert-danger");
        setMessage(result); // Visa felmeddelande om inloggningen misslyckas
      }
    } catch (error) {
      console.error("Error during adding city", error);
      setCheckResult(true); // Visa felmeddelande vid ett oväntat fel
      setColor("alert-danger");
      setMessage("Error during adding city");
    }
  };
  return (
    <>
      {checkResult && <Alert color={color} message={message} />}
      <AddCity onSubmit={handleFormSubmit} />
    </>
  );
};
