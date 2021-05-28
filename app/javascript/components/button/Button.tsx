import * as React from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'warning' | 'danger';
}

export const Button = (props: ButtonProps) => {
  const { className, children, variant, ...customProps } = props;

  return (
    <button className={clsx(styles.button, className, styles[variant || 'primary'])} {...customProps}>
      {children}
    </button>
  );
};
