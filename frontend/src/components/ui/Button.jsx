import { Link } from "react-router-dom";
import styles from "./Button.module.css";
import { Spinner } from "./Spinner";

/**
 * variant: primary | secondary | ghost | danger
 * size:    sm | md | lg
 * Pass `to` to render a router Link instead of a <button>.
 */
export function Button({
  variant = "primary",
  size = "md",
  to,
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  className = "",
  children,
  ...rest
}) {
  const cls = [styles.btn, styles[variant], styles[size], className].join(" ");
  const content = (
    <>
      {loading ? <Spinner size={14} /> : Icon && <Icon size={16} strokeWidth={1.75} />}
      {children && <span>{children}</span>}
      {IconRight && <IconRight size={16} strokeWidth={1.75} />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {content}
      </Link>
    );
  }
  return (
    <button className={cls} disabled={loading || rest.disabled} {...rest}>
      {content}
    </button>
  );
}
