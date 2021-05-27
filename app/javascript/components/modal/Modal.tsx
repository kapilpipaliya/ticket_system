import * as React from 'react';
import clsx from 'clsx';
import styles from './Modal.module.scss';

interface ModalProps {
  children: React.ReactNode;
  backdrop?: boolean;
}

export const Modal = (props: ModalProps) => {
  const { children, backdrop = true } = props;
  return (
    <div>
      {backdrop && <div className={styles.modalBackdrop}></div>}
      {children}
    </div>
  );
};
interface ModalBodyProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onHide?: () => void;
}

export const ModalBody = (props: ModalBodyProps) => {
  const { className, children, onHide, ...customProps } = props;
  return (
    <div className={clsx(styles.modalBody, className)} {...customProps}>
      {onHide && (
        <button className={styles.modalClose} onClick={onHide}>
          X
        </button>
      )}
      {children}
    </div>
  );
};
interface ModalHeaderProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}
export const ModalHeader = (props: ModalHeaderProps) => {
  const { className, children, ...customProps } = props;
  return (
    <div className={clsx(styles.modalHeader, className)} {...customProps}>
      {children}
    </div>
  );
};
interface ModalFooterProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}
export const ModalFooter = (props: ModalFooterProps) => {
  const { className, children, ...customProps } = props;
  return (
    <div className={clsx(styles.modalFooter, className)} {...customProps}>
      {children}
    </div>
  );
};
interface ModalTitleProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}
export const ModalTitle = (props: ModalTitleProps) => {
  const { className, children, ...customProps } = props;
  return (
    <div className={clsx(styles.modalTitle, className)} {...customProps}>
      {children}
    </div>
  );
};
