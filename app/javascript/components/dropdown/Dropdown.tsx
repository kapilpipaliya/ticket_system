import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import styles from './Dropdown.module.scss';

interface DropdownProps {
  label: React.ReactElement;
  children: React.ReactNode;
  className?: string;
}

export const Dropdown = (props: DropdownProps) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const { className, children, label } = props;

  useEffect(() => {
    if (isOpen) {
      const outSideHandler = event => {
        const el = ref.current;
        if (el && !el.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('click', outSideHandler);
      return () => document.removeEventListener('click', outSideHandler);
    }
  });

  return (
    <div ref={ref} className={clsx(styles.dropdown, className)}>
      <div className={styles.dropdownLabel} onClick={() => setIsOpen(prevState => !prevState)}>
        {label}
      </div>
      <div className={clsx(styles.dropdownMenu, { [styles.open]: isOpen })}>{children}</div>
    </div>
  );
};
