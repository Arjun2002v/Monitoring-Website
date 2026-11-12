import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Field } from "../components/ui/Field";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { useAuth } from "../hooks/useAuth";
import { PATHS } from "../routes/paths";
import styles from "./AuthPage.module.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(values);
      navigate(location.state?.from ?? PATHS.dashboard, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>
        Welcome <span className="serif-accent">back.</span>
      </h1>
      <p className={styles.lead}>Log in to see how your sites are doing.</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Alert>{error}</Alert>
        <Field label="Email" type="email" autoComplete="email" required value={values.email} onChange={set("email")} placeholder="you@company.com" autoFocus />
        <Field label="Password" type="password" autoComplete="current-password" required value={values.password} onChange={set("password")} placeholder="••••••••" />
        <Button type="submit" size="lg" loading={loading} className={styles.submit}>Log in</Button>
      </form>

      <p className={styles.switch}>
        New here? <Link to={PATHS.register}>Create an account</Link>
      </p>
    </div>
  );
}
