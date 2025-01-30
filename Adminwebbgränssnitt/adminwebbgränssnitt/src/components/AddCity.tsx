import { useState } from "react";
interface Props {
  onSubmit: (values: { name: string; country: string }) => void;
}
const AddCity = ({ onSubmit }: Props) => {
  const [formValues, setFormValues] = useState({
    name: "",
    country: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formValues.name) newErrors.name = "Name is required";
    if (!formValues.country) newErrors.country = "Country is required";

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    onSubmit(formValues); // Anropa `onSubmit` med formvärdena
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          City name
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
        />
        {errors.name && <small className="text-danger">{errors.name}</small>}
      </div>
      <div className="mb-3">
        <label htmlFor="country" className="form-label">
          Country
        </label>
        <input
          type="text"
          className="form-control"
          id="country"
          name="country"
          value={formValues.country}
          onChange={handleChange}
        />
        {errors.country && (
          <small className="text-danger">{errors.country}</small>
        )}
      </div>

      <button type="submit" className="btn btn-primary">
        Add
      </button>
    </form>
  );
};

export default AddCity;
