import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Field } from "../components/ui/Field";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { useAuth } from "../hooks/useAuth";
import { PATHS } from "../routes/paths";
import styles from "./AuthPage.module.css";

const MIN_PASSWORD = 8;

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const passwordTooShort = values.password.length > 0 && values.password.length < MIN_PASSWORD;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (values.password.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters.`);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register({ ...values, name: values.name.trim() });
      navigate(PATHS.dashboard, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>
        Start <span className="serif-accent">monitoring.</span>
      </h1>
      <p className={styles.lead}>Create an account and add your first site in under a minute.</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Alert>{error}</Alert>
        <Field label="Name" autoComplete="name" required value={values.name} onChange={set("name")} placeholder="Ada Lovelace" autoFocus />
        <Field label="Email" type="email" autoComplete="email" required value={values.email} onChange={set("email")} placeholder="you@company.com" />
        <Field
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          value={values.password}
          onChange={set("password")}
          placeholder="••••••••"
          hint={`At least ${MIN_PASSWORD} characters.`}
          error={passwordTooShort ? `At least ${MIN_PASSWORD} characters.` : null}
        />
        <Button type="submit" size="lg" loading={loading} className={styles.submit}>Create account</Button>
      </form>

      <p className={styles.switch}>
        Already have an account? <Link to={PATHS.login}>Log in</Link>
      </p>
    </div>
  );
}
