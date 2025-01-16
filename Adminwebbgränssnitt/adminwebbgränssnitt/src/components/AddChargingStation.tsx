import { useState, useEffect } from "react";
import chargingStations from "../../modules/chargingStations.ts";
import { useNavigate } from "react-router-dom";
import authModules from "../../modules/auths.ts";

const AddChargingStation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authModules.token) {
      navigate("/login");
    }
  }, []);

  const [formValues, setFormValues] = useState({
    cityId: "",
    latitude: "",
    longitude: "",
    totalPorts: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState("");

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formValues.cityId) newErrors.cityId = "City ID is required";
    if (!formValues.latitude) newErrors.latitude = "Latitude is required";
    if (!formValues.longitude) newErrors.longitude = "Longitude is required";
    if (!formValues.totalPorts)
      newErrors.totalPorts = "Total ports is required";

    return newErrors;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    try {
      const result = await chargingStations.addStation(
        formValues.cityId,
        formValues.latitude,
        formValues.longitude,
        formValues.totalPorts
      );
      if (result === "ok") {
        setMessage("Parking added successfully!");
        navigate("/");
      } else {
        setMessage(result);
      }
    } catch (error) {
      setMessage("Failed to add parking. Please try again.");
      console.error("Error adding parking:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && <p className="alert alert-info">{message}</p>}
      <div className="mb-3">
        <label htmlFor="cityId" className="form-label">
          City id
        </label>
        <input
          type="text"
          className="form-control"
          id="cityId"
          name="cityId"
          value={formValues.cityId}
          onChange={handleChange}
        />
        {errors.cityId && (
          <small className="text-danger">{errors.cityId}</small>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="latitude" className="form-label">
          Latitude
        </label>
        <input
          type="text"
          className="form-control"
          id="latitude"
          name="latitude"
          value={formValues.latitude}
          onChange={handleChange}
        />
        {errors.latitude && (
          <small className="text-danger">{errors.latitude}</small>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="longitude" className="form-label">
          Longitude
        </label>
        <input
          type="text"
          className="form-control"
          id="longitude"
          name="longitude"
          value={formValues.longitude}
          onChange={handleChange}
        />
        {errors.longitude && (
          <small className="text-danger">{errors.longitude}</small>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="totalPorts" className="form-label">
          Total ports
        </label>
        <input
          type="text"
          className="form-control"
          id="totalPorts"
          name="totalPorts"
          value={formValues.totalPorts}
          onChange={handleChange}
        />
        {errors.totalPorts && (
          <small className="text-danger">{errors.totalPorts}</small>
        )}
      </div>

      <button type="submit" className="btn btn-primary">
        Add station
      </button>
    </form>
  );
};

export default AddChargingStation;
