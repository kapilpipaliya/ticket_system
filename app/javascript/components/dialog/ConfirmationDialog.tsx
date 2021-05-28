import * as React from 'react';
import { LoadingButton } from '../button/LoadingButton';
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../modal/Modal';
import { Button } from '../button/Button';
import styles from '../../containers/admin/ticket_edit/TicketEdit.module.scss';

interface ConfirmationDialogProps {
  show: boolean;
  setShow: (boolean) => void;
  onSubmit: () => void;
  onCancel: () => void;
  title: string;
  body: string;
  okButtonLabel: string;
  loading: boolean;
  variant?: 'primary' | 'secondary' | 'warning' | 'danger';
}

export const ConfirmationDialog = (props: ConfirmationDialogProps) => {
  const { onCancel, show, setShow, title, body, okButtonLabel, onSubmit, loading, ...extraProps } = props;

  return (
    <>
      {show && (
        <Modal>
          <ModalBody onHide={onCancel}>
            {body}
            <ModalHeader>
              <ModalTitle>{title}</ModalTitle>
            </ModalHeader>
            <ModalFooter className={styles.buttonGroup}>
              <Button variant="secondary" onClick={onCancel}>
                Close
              </Button>
              <LoadingButton onClick={onSubmit} loading={loading} {...extraProps}>
                {okButtonLabel}
              </LoadingButton>
            </ModalFooter>
          </ModalBody>
        </Modal>
      )}
    </>
  );
};
