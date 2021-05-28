import * as React from 'react';
import clsx from 'clsx';
import styles from './Input.module.scss';

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  style?: React.CSSProperties;
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, children, ...customProps } = props;

  return <input className={clsx(styles.input, className)} ref={ref} {...customProps} />;
});
