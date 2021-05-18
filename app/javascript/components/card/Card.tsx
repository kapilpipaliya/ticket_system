import * as React from 'react';
import styles from './Card.module.scss'

interface CardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  style?: React.CSSProperties
}
export const Card = (props: CardProps) => {
  return (
    <div className={styles.card} style={props.style}>
      <div className={styles.content}>{props.children}</div>
      <div className={styles.footer}>{props.footer}</div>
    </div>
  );
};

