import * as React from 'react';
import clsx from 'clsx';

interface SpinnerProps {
  className?: string;
}
export const Spinner = (props: SpinnerProps) => {
  const { className } = props;

  return <div className={clsx('spinner-grow', className)} role="status"></div>;
};
