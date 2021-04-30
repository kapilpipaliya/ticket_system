import * as React from 'react';
import { Form } from 'react-bootstrap';

export const DisplayFormError = (props: { errors?: string[] }) => {
  return (
    <>
      {props.errors &&
        props.errors.map(error => {
          return (
            <Form.Text key={error} className="text-muted">
              {error}
            </Form.Text>
          );
        })}
    </>
  );
};
