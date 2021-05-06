import { CommentType } from '../../Types';
import * as React from 'react';
import { useRef, useState } from 'react';
import { IJodit } from 'jodit';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { DisplayFormError } from '../../../components/DisplayFormError';
import JoditEditor from 'jodit-react';
import { LoadingButton } from '../../../components/LoadingButton';

export const NewComponentForm = (props: { comment: CommentType; loading: boolean; toggleComment: () => void; onSubmit: (data: any) => void; errors: { [key: string]: string[] } }) => {
  const replySubjectRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState(props.comment.description);
  const config: Partial<IJodit['options']> = {
    readonly: false,
  };
  return (
    <Form>
      <Card>
        <Card.Body>
          <Card.Title>Reply:</Card.Title>
          <Row>
            <Col sm={12}>
              <Form.Group controlId="formSubject">
                <Form.Label>Subject</Form.Label>
                <Form.Control type="text" defaultValue={props.comment.title} ref={replySubjectRef} isInvalid={props.errors.title.length} />
                <DisplayFormError errors={props.errors.title} />
              </Form.Group>
            </Col>
            <Col sm={12}>
              <Form.Group controlId="formReply">
                <Form.Label>Description:</Form.Label>
                <JoditEditor value={description} config={config as any} onBlur={setDescription} />
                <div className={`${props.errors.description.length ? 'is-invalid' : ''}`} />
                <DisplayFormError errors={props.errors.description} />
              </Form.Group>
            </Col>
          </Row>
          <div>
            <LoadingButton
              variant="success"
              onClick={() =>
                props.onSubmit({
                  title: replySubjectRef.current.value,
                  description,
                })
              }
              loading={props.loading}
            >
              Send
            </LoadingButton>{' '}
            <Button variant="secondary" onClick={props.toggleComment}>
              Cancel
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Form>
  );
};
