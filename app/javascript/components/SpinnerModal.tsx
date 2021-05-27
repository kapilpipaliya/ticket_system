import { Spinner } from './Spinner';
import * as React from 'react';
import { Modal, ModalBody } from './modal/Modal';
import { Card, CardBody } from './card/Card';
import styles from './SpinnerModal.module.scss';

export const SpinnerModal = (props: { loading: boolean }) => {
  const { loading } = props;
  return (
    <>
      {loading && (
        <Modal backdrop={false}>
          <ModalBody>
            <Card className={styles.spinnerModal}>
              <CardBody>
                <Spinner />
                Loading ...
              </CardBody>
            </Card>
          </ModalBody>
        </Modal>
      )}
    </>
  );
};
