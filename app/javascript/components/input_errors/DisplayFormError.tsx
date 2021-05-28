import * as React from 'react';
import styles from './DisplayForm.module.scss';

export const DisplayFormError = (props: { errors?: string[] }) => {
  const { errors } = props;

  return (
    <>
      {errors &&
        errors.map(error => (
          <div className={styles.invalid} key={error}>
            {error}
          </div>
        ))}
    </>
  );
};
