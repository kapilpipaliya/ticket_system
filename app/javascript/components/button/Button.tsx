import * as React from 'react';
import styles from './Button.module.scss';
import clsx from 'clsx';

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}
export const Button = (props: ButtonProps) => {
  const { className, children, ...customProps } = props;
  return (
    <button className={clsx(styles.button, className, styles[props.variant])} {...customProps}>
      {children}
    </button>
  );
};
