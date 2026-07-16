import React from "react";
import Modal from "./Modal";
import Button from "./Button";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || "Confirm"}
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Confirm
          </Button>
        </>
      }
    >
      <p>{message || "Are you sure?"}</p>
    </Modal>
  );
};

export default ConfirmDialog;
