import * as React from 'react';
import { Form } from 'react-bootstrap';

export const DisplayFormError = (props: { errors?: string[] }) => {
  return (
    <>
      {props.errors &&
        props.errors.map(error => {
          return (
            <Form.Control.Feedback key={error} type="invalid">
              {error}
            </Form.Control.Feedback>
          );
        })}
    </>
  );
};
