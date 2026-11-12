import { useId } from "react";
import styles from "./Field.module.css";

/** Label + control + hint/error. Renders <select> when `options` is given. */
export function Field({ label, hint, error, options, className = "", ...inputProps }) {
  const id = useId();
  const describedBy = error || hint ? `${id}-desc` : undefined;
  const controlProps = {
    id,
    className: `${styles.control} ${error ? styles.invalid : ""}`,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
    ...inputProps,
  };

  return (
    <div className={`${styles.field} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      {options ? (
        <select {...controlProps}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input {...controlProps} />
      )}
      {(error || hint) && (
        <p id={describedBy} className={error ? styles.error : styles.hint}>
          {error || hint}
        </p>
      )}
    </div>
  );
}
