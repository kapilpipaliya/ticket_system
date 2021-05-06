import * as React from 'react';
import { Button, Spinner } from 'react-bootstrap';

export const LoadingButton = (props: { showSpinner?: boolean; variant?: string; onClick: (e: any) => void; loading: boolean; children: React.ReactNode }) => {
  return (
    <Button variant={props.variant} onClick={props.onClick} {...(props.loading ? { disabled: true } : {})}>
      {props.showSpinner && props.loading && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />}
      {props.children}
    </Button>
  );
};
LoadingButton.defaultProps = {
  variant: 'primary',
  showSpinner: true,
};
