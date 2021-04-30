import { Button, Modal } from 'react-bootstrap';
import * as React from 'react';

interface ConfirmationDialogProps {
  show: boolean;
  setShow: (boolean) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  title: string;
  body: string;
  okButtonLabel: string;
}

export const ConfirmationDialog = (props: ConfirmationDialogProps) => {
  const handleClose = () => props.onCancel();
  const handleSubmit = () => {
    props.onSubmit().then(r => {});
  };
  return (
    <>
      <Modal show={props.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {props.okButtonLabel}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
