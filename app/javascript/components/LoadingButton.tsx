import * as React from 'react';
import { Button, Spinner } from 'react-bootstrap';

interface LoadingButtonProps {
  showSpinner?: boolean;
  variant?: string;
  onClick: (e: any) => void;
  loading: boolean;
  children: React.ReactNode;
  className?: string;
}

export const LoadingButton = (props: LoadingButtonProps) => {
  const { variant, onClick, loading, showSpinner, children, ...extraProps } = props;
  return (
    <Button variant={variant} onClick={onClick} {...(loading ? { disabled: true } : {})} {...extraProps}>
      {showSpinner && loading && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />}
      {children}
    </Button>
  );
};
LoadingButton.defaultProps = {
  variant: 'primary',
  showSpinner: true,
};
