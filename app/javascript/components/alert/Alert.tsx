import * as React from 'react';
import clsx from 'clsx';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'custom-alert-primary' | 'custom-alert-warning';
  className?: string;
}

export const Alert = (props: AlertProps) => {
  const { className, children, variant, ...customProps } = props;

  return (
    <div className={clsx('custom-alert', variant, className)} {...customProps}>
      {children}
    </div>
  );
};
