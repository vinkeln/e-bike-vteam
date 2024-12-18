import { useState } from "react";

interface Props {
  onSubmit: (values: { email: string; password: string }) => void;
}

const LoginForm = ({ onSubmit }: Props) => {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues); // Anropa `onSubmit` med formvärdena
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
