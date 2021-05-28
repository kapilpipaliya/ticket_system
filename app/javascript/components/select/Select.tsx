import * as React from 'react';
import clsx from 'clsx';
import styles from './Select.module.scss';

interface SelectProps extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const { className, children, ...customProps } = props;

  return (
    <select className={clsx(styles.select, styles.formGroup, className)} ref={ref} {...customProps}>
      {children}
    </select>
  );
});
