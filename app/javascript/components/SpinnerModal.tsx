import { Card, Modal } from 'react-bootstrap';
import { Spinner } from './Spinner';
import * as React from 'react';

export const SpinnerModal = (props: { loading: boolean }) => {
  return (
    <>
      {props.loading && (
        <Modal show={true} centered animation={false} backdrop={false}>
          <Card className={'text-center'}>
            <Card.Body>
              <Spinner />
            </Card.Body>
          </Card>
        </Modal>
      )}
    </>
  );
};
