import * as React from "react";
import {useRef, useState} from "react";
import {Alert, Breadcrumb, Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import 'jodit';
import 'jodit/build/jodit.min.css';
import {IJodit} from "jodit";
import JoditEditor from "jodit-react";
// import {TopNavBar} from "./NavBar";

export const CreateTicket = () => {
    const [isSuccess, setIsSuccess] = useState(null);
    const subjectRef = useRef<HTMLInputElement>(null);
    const nameOfSubmitterRef = useRef<HTMLInputElement>(null);
    const emailOfSubmitterRef = useRef<HTMLInputElement>(null);
    const [description, setDescription] = useState('');
    const config: Partial<IJodit['options']> = {
        readonly: false
    };
    const submitForm = async () => {
        const csrfToken = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content
        try {
            const response = await fetch('/tickets', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    subject: subjectRef.current.value,
                    name_of_submitter: nameOfSubmitterRef.current.value,
                    email_of_submitter: emailOfSubmitterRef.current.value,
                    description
                })
            });
            const result = await response.json();
            if (result.id) {
                subjectRef.current.value = '';
                nameOfSubmitterRef.current.value = '';
                emailOfSubmitterRef.current.value = '';
                setDescription('')
                setIsSuccess(true);
                setTimeout(()=>setIsSuccess(false), 5000)
            }
        } catch (err) {
            alert(err);
        }
    }
    const handleSubmitForm = (e) => {
        e.preventDefault();
        submitForm().then(() => {
        });
    }
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
                        {isSuccess && <Alert variant="success" onClose={() => setIsSuccess(false)} dismissible>
                            <Alert.Heading>Thank you for submitting a ticket!</Alert.Heading>
                            <p>
                                We will reply soon...
                            </p>
                        </Alert>}
                        <Card>
                            <Card.Body><Form onSubmit={handleSubmitForm}>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group controlId="formSubject">
                                            <Form.Label>Subject</Form.Label>
                                            <Form.Control type="text" placeholder="Subject" ref={subjectRef}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group controlId="formName">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text" placeholder="Name" ref={nameOfSubmitterRef}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12}>
                                        <Form.Group controlId="formEmail">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" placeholder="Email" ref={emailOfSubmitterRef}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12}>
                                        <Form.Group controlId="formEmail">
                                            <Form.Label>Description</Form.Label>
                                            <JoditEditor key={2} value={description} config={config as any}
                                                         onBlur={setDescription}/>
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

                                </Row> </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container></>
    );
};