import * as React from 'react';
import clsx from 'clsx';
import styles from './Card.module.scss';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = (props: CardProps) => {
  const { className, children, ...customProps } = props;

  return (
    <div className={clsx(styles.card, className)} {...customProps}>
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody = (props: CardBodyProps) => {
  const { className, children, ...customProps } = props;

  return (
    <div className={clsx(styles.cardBody, className)} {...customProps}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader = (props: CardHeaderProps) => {
  const { className, children, ...customProps } = props;

  return (
    <div className={clsx(styles.cardHeader, className)} {...customProps}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter = (props: CardFooterProps) => {
  const { className, children, ...customProps } = props;

  return (
    <div className={clsx(styles.cardFooter, className)} {...customProps}>
      {children}
    </div>
  );
};
