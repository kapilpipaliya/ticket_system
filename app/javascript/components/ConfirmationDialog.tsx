import { Button, Modal } from 'react-bootstrap';
import * as React from 'react';
import { LoadingButton } from './LoadingButton';

interface ConfirmationDialogProps {
  show: boolean;
  setShow: (boolean) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  title: string;
  body: string;
  okButtonLabel: string;
  loading: boolean;
  variant?: string;
}

export const ConfirmationDialog = (props: ConfirmationDialogProps) => {
  const { onCancel, show, setShow, title, body, okButtonLabel, onSubmit, loading, ...extraProps } = props;
  const handleClose = () => onCancel();
  const handleSubmit = () => {
    onSubmit().then(r => {});
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <LoadingButton onClick={handleSubmit} loading={loading} {...extraProps}>
            {okButtonLabel}
          </LoadingButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};
