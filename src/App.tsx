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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!values.callSign) {
          newErrors.callSign = "Can't be empty";
        } else if (values.callSign.length < 3) {
          newErrors.callSign = "Use at least 3 characters";
        } else if (values.callSign.length > 20) {
          newErrors.callSign = "Use less than 20 characters";
        }

        if (!values.email) {
          newErrors.email = "Can't be empty";
        } else if (!emailRegex.test(values.email)) {
          newErrors.email = "Enter a valid email, like you@example.com";
        }

        if (!values.password) {
          newErrors.password = "Can't be blank";
        } else if (values.password.length < 8) {
          newErrors.password = "Use at least 8 characters";
        }

        if (!values.confirmPassword) {
          newErrors.confirmPassword = "Can't be blank";
        }
        if (values.password !== values.confirmPassword) {
          newErrors.confirmPassword = "Passwords don't match";
        }
        if (!values.acceptTerms) {
          newErrors.acceptTerms = "Accept the terms to continue";
        }
        return newErrors;
      },
      onSubmit: async () => {
        setFormData(() => ({
          callSign: "",
          email: "",
          password: "",
          confirmPassword: "",
          acceptTerms: false,
        }));
        alert("Submission Successful");
      },
    },
  );

  const formFooter = (
    <>
      <p>
        Already an operator?{" "}
        <a href="#" className="accent-text">
          Log in
        </a>
      </p>
    </>
  );

  return (
    <>
      <div className="main-content">
        <section className="main-header">
          <Logo></Logo>
          <span className="text-upper show-on-mobile">{numReady}/5 ready</span>
        </section>
        <section className="hero">
          <h1>
            <span className="text-accent">//</span> Join the Nexus
          </h1>
          <p className="text-upper">Initialize your Neoncore identity</p>
        </section>
        <section className="operator-details">
          <div className="row">
            <div className="operator-details__id">
              <span className="text-upper">Operator ID</span>
              {(formData.callSign && !errors.callSign && (
                <span className="operator-details__callSign">
                  {formData.callSign}
                </span>
              )) || (
                <span className="text-upper operator-details__noCallSign">
                  Unassigned
                </span>
              )}
            </div>
            <div className="hide-on-mobile">
              <span className="text-upper">{numReady}/5 ready</span>
            </div>
          </div>
          <ul>
            <li className="row">
              <span className="attribute text-upper">Callsign</span>
              <span
                className={`value text-upper ${errors.callSign ? "text-error" : ""}`}
              >
                {errors.callSign
                  ? formData.callSign.length < 3
                    ? "Too short"
                    : "Too long"
                  : !formData.callSign && !errors.callSign
                    ? "Pending"
                    : "OK"}
              </span>
            </li>

            <li className="row">
              <span className="attribute text-upper">Email</span>
              <span
                className={`value text-upper ${errors.email ? "text-error" : ""}`}
              >
                {errors.email
                  ? "Malformed"
                  : !formData.email
                    ? "Pending"
                    : "OK"}
              </span>
            </li>

            <li className="row">
              <span className="attribute text-upper">Password</span>
              <span
                className={`value text-upper ${errors.password ? "text-error" : ""}`}
              >
                {errors.password
                  ? formData.password.length < 8
                    ? "Too short"
                    : "Malformed"
                  : !formData.password && !errors.password
                    ? "Pending"
                    : "OK"}
              </span>
            </li>

            <li className="row">
              <span className="attribute text-upper">Confirm</span>
              <span
                className={`value text-upper ${errors.confirmPassword ? "text-error" : ""}`}
              >
                {errors.confirmPassword
                  ? formData.confirmPassword !== formData.password
                    ? "Mismatch"
                    : "Too short"
                  : !formData.confirmPassword && !errors.confirmPassword
                    ? "Pending"
                    : "OK"}
              </span>
            </li>

            <li className="row">
              <span className="attribute text-upper">Terms</span>
              <span
                className={`value text-upper ${errors.acceptTerms ? "text-error" : ""}`}
              >
                {errors.acceptTerms
                  ? "required"
                  : !formData.acceptTerms
                    ? "Pending"
                    : "OK"}
              </span>
            </li>
          </ul>
        </section>
      </div>
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
          errorMessage={errors.callSign}
          autoComplete="off"
        />

        <FormInput
          id="email"
          name="email"
          label="Email"
          type="text"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          errorMessage={errors.email}
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
          autoComplete="new-password"
        />

        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          errorMessage={errors.confirmPassword}
          autoComplete="new-password"
        />

        <FormInput
          id="acceptTerms"
          name="acceptTerms"
          label="I accept the [Terms](#terms) and [Privacy Policy](#privacy)."
          type="checkbox"
          value={formData.acceptTerms}
          onChange={handleChange}
          errorMessage={errors.acceptTerms}
        />
      </Form>
    </>
  );
}

export default App;
