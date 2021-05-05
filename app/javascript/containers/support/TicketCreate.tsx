import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Alert, Breadcrumb, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import 'jodit';
import 'jodit/build/jodit.min.css';
import { IJodit } from 'jodit';
import JoditEditor from 'jodit-react';
import { CurrentUser } from './TicketTypes';
import { DisplayFormError } from './DisplayFormError';
import { getInitialErrorState, ticketCreate } from './serviceTicket';
import { fetchCurrentUser } from './serviceUser';
// import {TopNavBar} from "./NavBar";

export const TicketCreate = () => {
  const [isSuccess, setIsSuccess] = useState(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const nameOfSubmitterRef = useRef<HTMLInputElement>(null);
  const emailOfSubmitterRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [errors, setErrors] = useState(getInitialErrorState());
  const config: Partial<IJodit['options']> = {
    readonly: false,
  };

  useEffect(() => {
    fetchCurrentUser().then(resp => setCurrentUser(resp));
  }, []);

  const handleSubmitForm = e => {
    e.preventDefault();
    const submitForm = async () => {
      const result = await ticketCreate({
        subject: subjectRef.current.value,
        name: nameOfSubmitterRef.current.value,
        email: emailOfSubmitterRef.current.value,
        description,
        creator_id: currentUser ? currentUser.id : currentUser,
      });
      if (result.id) {
        subjectRef.current.value = '';
        nameOfSubmitterRef.current.value = '';
        emailOfSubmitterRef.current.value = '';
        setDescription('');
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 5000);
        setErrors({ ...getInitialErrorState() });
      } else {
        setErrors({ ...getInitialErrorState(), ...result });
      }
    };
    submitForm().then(() => {});
  };

  return (
    <>
      {/*<TopNavBar/>*/}
      <Container>
        <Breadcrumb className={'mt-3'}>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Create Ticket</Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          <Col sm={12}>
            {isSuccess && (
              <Alert variant="success" onClose={() => setIsSuccess(false)} dismissible>
                <Alert.Heading>Thank you for submitting a ticket!</Alert.Heading>
                <p>We will reply soon...</p>
              </Alert>
            )}
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmitForm}>
                  <Row>
                    <Col sm={6}>
                      <Form.Group controlId="formSubject">
                        <Form.Label>Subject</Form.Label>
                        <Form.Control type="text" placeholder="Subject" ref={subjectRef} isInvalid={errors.subject.length} />
                        <DisplayFormError errors={errors.subject} />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Name" ref={nameOfSubmitterRef} isInvalid={errors.name.length} />
                        <DisplayFormError errors={errors.name} />
                      </Form.Group>
                    </Col>
                    <Col sm={12}>
                      <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Email" ref={emailOfSubmitterRef} isInvalid={errors.email.length} />
                        <DisplayFormError errors={errors.email} />
                      </Form.Group>
                    </Col>
                    <Col sm={12}>
                      <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <JoditEditor key={2} value={description} config={config as any} onBlur={setDescription} />
                        <div className={`${errors.description.length ? 'is-invalid' : ''}`} />
                        <DisplayFormError errors={errors.description} />
                      </Form.Group>
                    </Col>
                    {/*<Col sm={12}>
                                    <div className="form-group fill">
                                        <div className="file btn waves-effect waves-light btn-outline-primary mt-3 file-btn">
                                            <i className="feather icon-paperclip" />
                                            Add Attachment
                                            <input type="file" name="file" />
                                        </div>
                                    </div>
                                </Col>*/}
                    <Col sm={12}>
                      <Button type="submit" className="waves-effect waves-light">
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};
