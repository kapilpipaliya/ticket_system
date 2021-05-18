import * as React from 'react';
import styles from './Card.module.scss';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}
export const Card = (props: CardProps) => {
  return (
    <div className={clsx(styles.card, props.className)} style={props.style}>
      {props.header && <div className={clsx(styles.header, props.headerClassName)}>{props.header}</div>}
      {props.children && <div className={clsx(styles.content, props.contentClassName)}>{props.children}</div>}
      {props.footer && <div className={clsx(styles.footer, props.footerClassName)}>{props.footer}</div>}
    </div>
  );
};
