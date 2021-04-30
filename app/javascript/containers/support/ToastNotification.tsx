import { Alert, Toast } from 'react-bootstrap';
import * as React from 'react';

interface ToastNotificationProps {
  show: boolean;
  setShow: (boolean) => void;
  message: string;
}

export const ToastNotification = (props: ToastNotificationProps) => {
  return (
    <div>
      <Toast
        onClose={() => props.setShow(false)}
        show={props.show}
        delay={3000}
        autohide
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
        }}
      >
        <Toast.Header>
          <strong className="mr-auto">Success</strong>
          <small>just now</small>
        </Toast.Header>
        <Toast.Body>
          <Alert variant="success">{props.message}</Alert>
        </Toast.Body>
      </Toast>
    </div>
  );
};
