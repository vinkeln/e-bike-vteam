import RegisterForm from "../components/RegisterForm";
import authModules from "../../modules/auths.ts";
import Alert from "../components/Alert.tsx";
import { useState } from "react";

const Register = () => {
  const [checkRegister, setCheckRegister] = useState(false);

  const handleFormSubmit = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const result = await authModules.register(
        values.name,
        values.password,
        values.email,
        "admin"
      );

      if (result === "ok") {
        await authModules.login(values.email, values.password);
      } else {
        setCheckRegister(true); // Visa ett felmeddelande
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setCheckRegister(true); // Hantera oväntade fel
    }
  };

  return (
    <>
      {checkRegister && (
        <Alert message="Registration failed. Please try again." />
      )}
      <RegisterForm onSubmit={handleFormSubmit} />
    </>
  );
};

export default Register;
