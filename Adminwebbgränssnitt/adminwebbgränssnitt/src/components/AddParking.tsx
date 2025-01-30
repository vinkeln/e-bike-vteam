import { useState, useEffect } from "react";
import parkingModules from "../../modules/parkings";
import { useNavigate } from "react-router-dom";
import authModules from "../../modules/auths.ts";

const AddParking = () => {
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
    maxSpeed: "",
    capacity: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState("");

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formValues.cityId) newErrors.cityId = "City ID is required";
    if (!formValues.latitude || isNaN(Number(formValues.latitude)))
      newErrors.latitude = "Latitude must be a number";
    if (!formValues.longitude || isNaN(Number(formValues.longitude)))
      newErrors.longitude = "Longitude must be a number";
    if (!formValues.maxSpeed || isNaN(Number(formValues.maxSpeed)))
      newErrors.maxSpeed = "Max speed must be a number";
    if (!formValues.capacity || isNaN(Number(formValues.capacity)))
      newErrors.capacity = "Capacity must be a number";
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
      const result = await parkingModules.addParking(
        formValues.cityId,
        formValues.latitude,
        formValues.longitude,
        formValues.maxSpeed,
        formValues.capacity
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
        <label htmlFor="maxSpeed" className="form-label">
          Max speed
        </label>
        <input
          type="text"
          className="form-control"
          id="maxSpeed"
          name="maxSpeed"
          value={formValues.maxSpeed}
          onChange={handleChange}
        />
        {errors.maxSpeed && (
          <small className="text-danger">{errors.maxSpeed}</small>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="capacity" className="form-label">
          Capacity
        </label>
        <input
          type="text"
          className="form-control"
          id="capacity"
          name="capacity"
          value={formValues.capacity}
          onChange={handleChange}
        />
        {errors.capacity && (
          <small className="text-danger">{errors.capacity}</small>
        )}
      </div>

      <button type="submit" className="btn btn-primary">
        Add Parking
      </button>
    </form>
  );
};

export default AddParking;
