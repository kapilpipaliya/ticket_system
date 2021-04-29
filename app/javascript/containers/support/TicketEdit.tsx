import * as React from 'react';
import {Row, Col, Card, Form, Button, Container} from 'react-bootstrap';
import {useEffect, useRef, useState} from "react";
import {Comment, Ticket} from "./TicketTypes";
import {
    Lock,
    Star,
    MessageSquare,
    Edit,
    UserCheck,
    Edit2,
    Trash2,
    CheckCircle,
    Mail,
    Calendar,
    Clock,
    ThumbsUp
} from 'react-feather';
import {IJodit} from "jodit";
import JoditEditor from "jodit-react";

export const TicketEdit = () => {
    const [ticket, setTicket] = useState<Ticket>({
        id: 0,
        subject: '',
        description: '',
        email_of_submitter: '',
        name_of_submitter: '',
        assigned_to: '',
        created_at: '',
        updated_at: '',
        url: ''
    });
    const replySubjectRef = useRef<HTMLInputElement>(null);
    const [isReplyEditorOpen, setIsReplyEditorOpen] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [description, setDescription] = useState('');
    const config: Partial<IJodit['options']> = {
        readonly: false
    };
    useEffect(() => {
        const fetchTicketData = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
            try {
                const response = await fetch(`/tickets/${id}.json`)
                const ticket = await response.json();
                setTicket(ticket);
                const responseComments = await fetch(`/comments/by_ticket/${id}.json`)
                const comments = await responseComments.json();
                setComments(comments);
            } catch (err) {
                alert(err);
            }
        }
        fetchTicketData().then(r => {
        })
    }, [])
    const handleSendReply = () => {
        const submitComment = async () => {
            const csrfToken = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content
            try {
                const response = await fetch('/comments', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        title: replySubjectRef.current.value,
                        description,
                        ticket_id: ticket.id
                    })
                });
                const result = await response.json();
                if (result.id) {
                    setIsReplyEditorOpen(false);
                    setComments((prev) => {
                        return [...prev, result];
                    })
                }
            } catch (err) {
                alert(err);
            }
        }
        submitComment().then(r => {
        })
    }
    const handleDeleteComment = (commentId) => () => {
        const deleteComment = async () => {
            const csrfToken = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content
            try {
                const response = await fetch(`/comments/${commentId}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                });
                const result = await response.text();
                setComments((prev) => {
                    return prev.filter(x => x.id !== commentId)
                })
            } catch (err) {
                alert(err);
            }
        }
        deleteComment().then(r => {
        })
    }
    const handleDeleteTicket = () => {
        // Todo
    }
    return (
        <Container>
            <Row>
                <Col lg={8}>
                    <Card>
                        <Card.Header>
                            <h5>
                                <Lock className={'mr-1'}/>
                                {ticket.subject}
                            </h5>
                        </Card.Header>
                        <Card.Body className="topic-name">
                            <Row className="align-items-center">
                                <Col md={8}>
                                    <h6 className="d-inline-block mb-0"
                                        dangerouslySetInnerHTML={{__html: ticket.description}}/>
                                </Col>
                                <Col md={4}>

                                </Col>
                            </Row>
                        </Card.Body>

                        {comments.map(comment => <Card.Body key={comment.id}
                                                            className="hd-detail hdd-admin border-bottom">
                            <Row>
                                <Col sm="auto">

                                    <p>
                                        <i className="fas fa-thumbs-up mr-1 text-primary"/>#{comment.id}
                                    </p>
                                </Col>
                                <Col>
                                    <div className="comment-top">
                                        <h4>
                                            You <small className="text-muted f-w-400">replied</small>
                                        </h4>
                                        <p>{comment.created_at}</p>
                                    </div>
                                    <div dangerouslySetInnerHTML={{__html: comment.description}}></div>
                                </Col>
                                <Col sm="auto" className="pl-0 col-right">
                                    <Card.Body className="text-center">
                                        <ul className="list-unstyled mb-0 edit-del">
                                            <li className="d-inline-block f-20 mr-1">
                                                <a href={'#'}>
                                                    <Edit2 className={'text-muted'}/>
                                                </a>
                                            </li>
                                            <li className="d-inline-block f-20">
                                                <a href={'#'}>
                                                    <Trash2 className={'text-muted'}
                                                            onClick={handleDeleteComment(comment.id)}/>
                                                </a>
                                            </li>
                                        </ul>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card.Body>)}
                        <div className="bg-light p-3">
                            <Row className="align-items-center">
                                <Col>
                                    <Button variant="secondary" className={'text-uppercase'} onClick={() => {
                                        setIsReplyEditorOpen(!isReplyEditorOpen)
                                    }}><MessageSquare className={'mr-2'}/>Post a reply</Button>
                                </Col>
                            </Row>
                        </div>
                        {isReplyEditorOpen && <Form>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Reply:</Card.Title>
                                    <Row>
                                        <Col sm={12}>
                                            <Form.Group controlId="formSubject">
                                                <Form.Label>Subject</Form.Label>
                                                <Form.Control type="text" placeholder="Subject" ref={replySubjectRef}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={12}>
                                            <Form.Group controlId="formReply">
                                                <Form.Label>Description:</Form.Label>
                                                <JoditEditor key={2} value={description} config={config as any}
                                                             onBlur={setDescription}/>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <div>
                                        <Button variant="success" onClick={handleSendReply}>Send</Button>{' '}
                                        <Button variant="secondary"
                                                onClick={() => setIsReplyEditorOpen(!isReplyEditorOpen)}>Cancel</Button>
                                    </div>
                                </Card.Body>
                            </Card>


                        </Form>}

                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="hdd-right-inner">
                        <Card.Header>
                            <h5>Ticket Details</h5>
                        </Card.Header>
                        <Card.Body>
                            {!!comments.length &&
                            <div className="alert alert-success d-block text-center text-uppercase">
                                <CheckCircle className={'mr-2'}/>
                                Replied
                            </div>}
                            <div className="select-block">
                                <select className="js-status-multiple col-sm-12 form-control">
                                    <option>Open</option>
                                    <option>Close</option>
                                    <option>CLosed Forever</option>
                                </select>
                                <select className="js-assigned-multiple col-sm-12 form-control">
                                    <option value="avatar-5">Jack Pall</option>
                                    <option value="avatar-4">Liza Mac</option>
                                    <option value="avatar-3">Lina Hop</option>
                                    <option value="avatar-2">Sam Hunk</option>
                                    <option value="avatar-1">Jhon White</option>
                                </select>
                            </div>
                        </Card.Body>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <div className="media align-items-center">
                                    <label className="mb-0 wid-100">Name:</label>
                                    <div className="media-body">
                                        <p className="mb-0">

                                            <a href={'#'}>{ticket.name_of_submitter}</a>
                                        </p>
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <div className="media align-items-center">
                                    <label className="mb-0 wid-100">Email:</label>
                                    <div className="media-body">
                                        <p className="mb-0">
                                            <Mail className={'mr-1'}/>
                                            <a href={'#'}>{ticket.email_of_submitter}</a>
                                        </p>
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <div className="media align-items-center">
                                    <label className="mb-0 wid-100">Assigned To:</label>
                                    <div className="media-body">
                                        <p className="mb-0">

                                            <a href={'#'}>{ticket.assigned_to}</a>
                                        </p>
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <div className="media align-items-center">
                                    <label className="mb-0 wid-100">Created:</label>
                                    <div className="media-body">
                                        <p className="mb-0">
                                            <Calendar className={'mr-1'}/>
                                            <label className="mb-0">{ticket.created_at}</label>
                                        </p>
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <div className="media align-items-center">
                                    <label className="mb-0 wid-100">Response:</label>
                                    <div className="media-body">
                                        <p className="mb-0">
                                            <Clock className={'mr-1'}/>
                                            <label className="mb-0">{ticket.updated_at}</label>
                                        </p>
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item py-3">
                                <button type="button" className="btn btn-danger">
                                    <Trash2 className={'mr-2'} onClick={handleDeleteTicket}/>
                                    Delete Ticket
                                </button>
                            </li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
export default TicketEdit;
