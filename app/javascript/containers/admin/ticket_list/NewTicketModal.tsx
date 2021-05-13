import { CurrentUser, Ticket } from '../../Types';
import * as React from 'react';
import { useRef, useState } from 'react';
import { IJodit } from 'jodit';
import { getInitialErrorState, ticketCreate } from '../../../services/serviceTicket';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { Trello } from 'react-feather';
import { useMutation } from 'react-query';
import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from 'jodit-react';
import { DisplayFormError } from '../../../components/DisplayFormError';
import { LoadingButton } from '../../../components/LoadingButton';

interface NewTicketModalProps {
  show: boolean;
  onHide: () => void;
  onNewTicket: (ticket: Ticket) => void;
  currentUser: CurrentUser;
}

export const NewTicketModal = (props: NewTicketModalProps) => {
  const subjectRef = useRef<HTMLInputElement>(null);
  const nameOfSubmitterRef = useRef<HTMLInputElement>(null);
  const emailOfSubmitterRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');
  const config: Partial<IJodit['options']> = {
    readonly: false,
  };
  const [errors, setErrors] = useState(getInitialErrorState());

  const mutation = useMutation(async () => {
    const result = await ticketCreate({
      subject: subjectRef.current.value,
      name: nameOfSubmitterRef.current.value,
      email: emailOfSubmitterRef.current.value,
      description,
      creator_id: props.currentUser ? props.currentUser.id : props.currentUser,
    });
    if (result.id) {
      subjectRef.current.value = '';
      nameOfSubmitterRef.current.value = '';
      emailOfSubmitterRef.current.value = '';
      setDescription('');
      setErrors({ ...getInitialErrorState() });
      props.onHide();
      props.onNewTicket(result);
    } else {
      setErrors({ ...getInitialErrorState(), ...result });
    }
    return result;
  });

  const handleSubmitForm = e => {
    e.preventDefault();
    mutation.mutate();
  };

  const onClear = () => {
    subjectRef.current.value = '';
    nameOfSubmitterRef.current.value = '';
    emailOfSubmitterRef.current.value = '';
    setDescription('');
    props.onHide();
  };

  return (
    <Modal show={props.show} onHide={props.onHide} size={'xl'}>
      <Modal.Header>
        <Modal.Title as="h5">
          <Trello className={'me-2'} />
          Add Ticket
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col sm={6} className={'mb-2'}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Name" value={props.currentUser.first_name} ref={nameOfSubmitterRef} disabled isInvalid={errors.name.length} />
              <DisplayFormError errors={errors.name} />
            </Form.Group>
          </Col>
          <Col sm={6} className={'mb-2'}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" value={props.currentUser.email} ref={emailOfSubmitterRef} disabled isInvalid={errors.email.length} />
              <DisplayFormError errors={errors.email} />
            </Form.Group>
          </Col>
          <Col sm={12} className={'mb-2'}>
            <Form.Group controlId="formSubject">
              <Form.Label>Subject</Form.Label>
              <Form.Control type="text" placeholder="I did not received burger." ref={subjectRef} isInvalid={errors.subject.length} />
              <DisplayFormError errors={errors.subject} />
            </Form.Group>
          </Col>
          <Col sm={12} className={'mb-2'}>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <JoditEditor key={2} value={description} config={config as any} onBlur={setDescription} />
              <div className={`${errors.description.length ? 'is-invalid' : ''}`} />
              <DisplayFormError errors={errors.description} />
            </Form.Group>
          </Col>
          <Col sm={12} className={'mb-2'}>
            <div className="form-group fill">
              <label className="floating-label" htmlFor="Icon">
                Image
              </label>
              <input type="file" className="form-control" id="Icon" placeholder="Image" />
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClear}>
          Cancel
        </Button>
        <LoadingButton onClick={handleSubmitForm} loading={mutation.isLoading}>
          Submit
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};
