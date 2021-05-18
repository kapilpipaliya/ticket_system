import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import styles from './Dropdown.module.scss';
import clsx from 'clsx';

interface DropdownProps {
  label: React.ReactElement;
  children: React.ReactNode;
  className?: string;
}
export const Dropdown = (props: DropdownProps) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const outSideHandler = event => {
        const el = ref.current;
        if (el && !el.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('click', outSideHandler);
      return () => {
        document.removeEventListener('click', outSideHandler);
      };
    }
  });

  return (
    <div ref={ref} className={clsx(styles.dropdown, props.className)}>
      <div className={styles.dropdownLabel} onClick={() => setIsOpen(!isOpen)}>
        {props.label}
      </div>
      <div className={clsx(styles.dropdownMenu, { [styles.open]: isOpen })}>{props.children}</div>
    </div>
  );
};
