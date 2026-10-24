import { useState } from "react";
import FormInput from "@components/FormInput";
import Form from "@components/Form";
import { useForm } from "@hooks/useFormValidation";
import Logo from "@assets/images/logo.svg?react";

function App() {
  const [numReady, setNumready] = useState(0);
  const { formData, setFormData, errors, handleChange, handleSubmit } = useForm(
    {
      initialValues: {
        callSign: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
      },
      validate: (values) => {
        const newErrors: Partial<Record<keyof typeof values, string>> = {};
        if (!values.callSign) newErrors.callSign = "Can't be empty";
        if (!values.email) newErrors.email = "Can't be empty";
        if (!values.password) newErrors.password = "Can't be blank";
        if (values.password !== values.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        if (!values.acceptTerms)
          newErrors.acceptTerms = "Must accept to create account";
        return newErrors;
      },
      onSubmit: async (values) => {
        alert("Submission Successful");
      },
    },
  );

  const formFooter = (
    <>
      <p>
        Already an operator?{" "}
        <a href="#" className="accent-text">
          Login
        </a>
      </p>
    </>
  );

  return (
    <>
      <header className="main-header">
        <Logo></Logo>
        <span className="text-upper">{numReady}/5 ready</span>
      </header>
      <section className="hero">
        <h1>
          <span className="text-accent">//</span> Join the Nexus
        </h1>
        <p className="text-upper">Initialize your Neoncore identity</p>
      </section>
      <section className="operator-details">
        <div className="operator-details__id">
          <span className="text-upper">Operator ID</span>
          <span className="text-upper" id="operatorId">
            Unassigned
          </span>
        </div>
      </section>
      <Form
        title="New Operator"
        description="All fields required"
        submitText="Initialize Account"
        onSubmit={handleSubmit}
        footerContent={formFooter}
      >
        <FormInput
          id="callSign"
          name="callSign"
          label="Callsign"
          type="text"
          placeholder="e.g. Vortex_07"
          value={formData.callSign}
          onChange={handleChange}
          errorMessage={errors.Callsign}
          required
          autoComplete="off"
        />

        <FormInput
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          errorMessage={errors.email}
          required
          autoComplete="email"
        />

        <FormInput
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          errorMessage={errors.password}
          required
          minLength={8}
          autoComplete="new-password"
        />

        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength={8}
          autoComplete="new-password"
        />

        <FormInput
          id="acceptTerms"
          name="acceptTerms"
          label="I accept the Terms and Privacy Policy."
          type="checkbox"
          value={formData.acceptTerms}
          onChange={handleChange}
          required
        />
      </Form>
    </>
  );
}

export default App;
