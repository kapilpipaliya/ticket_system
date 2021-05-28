import * as React from 'react';
import { Button } from './Button';
import { Spinner } from '../spinner/Spinner';

interface LoadingButtonProps {
  showSpinner?: boolean;
  variant?: 'primary' | 'secondary' | 'warning' | 'danger';
  onClick: (e: any) => void;
  loading: boolean;
  children: React.ReactNode;
  className?: string;
}

export const LoadingButton = (props: LoadingButtonProps) => {
  const { variant = 'primary', onClick, loading, showSpinner = true, children, ...extraProps } = props;

  return (
    <Button variant={variant} onClick={onClick} {...(loading ? { disabled: true } : {})} {...extraProps}>
      {showSpinner && loading && <Spinner />}
      {children}
    </Button>
  );
};
