import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";

export function ConfirmDeleteModal({ monitor, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    setDeleting(true);
    setError(null);
    try {
      await onConfirm(monitor);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      open={Boolean(monitor)}
      onClose={onClose}
      title="Delete monitor?"
      description={monitor ? `"${monitor.name}" and its full check history will be removed. This can't be undone.` : ""}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirm} loading={deleting}>Delete monitor</Button>
        </>
      }
    >
      <Alert>{error}</Alert>
    </Modal>
  );
}
