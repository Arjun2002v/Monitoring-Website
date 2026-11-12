import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { Field } from "../ui/Field";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";
import { CHECK_INTERVALS } from "../../config/site";

const EMPTY = { name: "", url: "https://", interval: 60 };

function validate({ name, url }) {
  const errors = {};
  if (!name.trim()) errors.name = "Give this monitor a name.";
  try {
    const parsed = new URL(url);
    if (!/^https?:$/.test(parsed.protocol)) throw new Error();
  } catch {
    errors.url = "Enter a full URL starting with http:// or https://";
  }
  return errors;
}

/** Create or edit a monitor. Pass `monitor` to edit. */
export function MonitorFormModal({ open, monitor, onClose, onSubmit }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(monitor);

  useEffect(() => {
    if (open) {
      setValues(monitor ? { name: monitor.name, url: monitor.url, interval: monitor.interval } : EMPTY);
      setErrors({});
      setServerError(null);
    }
  }, [open, monitor]);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    setServerError(null);
    try {
      await onSubmit({ ...values, name: values.name.trim(), url: values.url.trim() });
      onClose();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit monitor" : "New monitor"}
      description={isEdit ? "Changes take effect on the next check." : "We'll start checking this URL right away."}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" form="monitor-form" loading={saving}>
            {isEdit ? "Save changes" : "Create monitor"}
          </Button>
        </>
      }
    >
      <form id="monitor-form" onSubmit={handleSubmit} noValidate style={{ display: "grid", gap: 16 }}>
        <Alert>{serverError}</Alert>
        <Field label="Name" placeholder="Marketing site" value={values.name} onChange={set("name")} error={errors.name} autoFocus />
        <Field label="URL" placeholder="https://example.com" value={values.url} onChange={set("url")} error={errors.url} inputMode="url" />
        <Field label="Check frequency" value={values.interval} onChange={set("interval")} options={CHECK_INTERVALS} />
      </form>
    </Modal>
  );
}
