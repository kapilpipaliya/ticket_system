import * as React from 'react';
import clsx from 'clsx';
import styles from './Spinner.module.scss';

interface SpinnerProps {
  className?: string;
}
export const Spinner = (props: SpinnerProps) => {
  const { className } = props;
  return <div className={clsx(styles.spinnerGrow, className)} role="status"></div>;
};
