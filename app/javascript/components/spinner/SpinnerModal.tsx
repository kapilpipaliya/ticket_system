import { Spinner } from './Spinner';
import * as React from 'react';
import { Modal, ModalBody } from '../modal/Modal';
import { Card, CardBody } from '../card/Card';
import styles from './SpinnerModal.module.scss';

export const SpinnerModal = (props: { loading: boolean }) => {
  const { loading } = props;

  return (
    <>
      {loading && (
        <Modal backdrop={false}>
          <ModalBody className={styles.spinnerModal}>
            <Card className={styles.spinnerCard}>
              <CardBody>
                <Spinner className={styles.spinnerCircle}/>
                <span>Loading ...</span>
              </CardBody>
            </Card>
          </ModalBody>
        </Modal>
      )}
    </>
  );
};
