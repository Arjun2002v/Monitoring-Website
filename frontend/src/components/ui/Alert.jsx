import { AlertCircle } from "lucide-react";
import styles from "./Alert.module.css";

export function Alert({ children }) {
  if (!children) return null;
  return (
    <div className={styles.alert} role="alert">
      <AlertCircle size={16} strokeWidth={1.75} />
      <span>{children}</span>
    </div>
  );
}
