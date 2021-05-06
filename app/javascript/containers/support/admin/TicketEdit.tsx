import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { CurrentUser } from './TicketTypes';
import { CheckCircle, Edit2, FileText, MessageSquare, Save, Trash2 } from 'react-feather';
import { useMutation, useQuery } from 'react-query';
import { IJodit } from 'jodit';
import JoditEditor from 'jodit-react';
import { fetchAllTicketStatus, fetchTicketData, getInitialTicketState, ticketDelete, ticketUpdate } from './serviceTicket';
import { deleteComment, fetchCommentData, submitTicketReply } from './serviceComment';
import { fetchAllUsers, fetchCurrentUser } from './serviceUser';
import { ToastNotification } from './ToastNotification';
import { ConfirmationDialog } from './ConfirmationDialog';
import * as UrlPattern from 'url-pattern';
import { LoadingButton } from '../../../components/LoadingButton';

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export const TicketEdit = () => {
  const [ticketId, setTicketId] = useState(() => {
    const pattern = new UrlPattern('/tickets/(:id)/edit');
    const matches = pattern.match(window.location.pathname);
    return matches.id;
  });
  const replySubjectRef = useRef<HTMLInputElement>(null);
  const [isReplyEditorOpen, setIsReplyEditorOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [allStatus, setAllStatus] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [newStatus, setNewStatus] = useState('open');
  const [newAssignedToID, setNewAssignedToID] = useState<'' | number>('');
  const [ticketDeleteConfirmation, setTicketDeleteConfirmation] = useState(false);
  const [commentDeleteConfirmation, setCommentDeleteConfirmation] = useState(false);
  const [selectedComment, setSelectedComment] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const config: Partial<IJodit['options']> = {
    readonly: false,
  };

  const { isLoading: isTicketLoading, error: ticketError, data: ticketData, isFetching, refetch: reFetchTicket } = useQuery(['ticketData'], async () => {
    const resp = await fetchTicketData(ticketId);
    setNewStatus(resp.status);
    setNewAssignedToID(resp.assignee_id || '');
    return resp;
  });
  const { isLoading: isCommentLoading, error: commentError, data: commentsData, refetch: reFetchComment } = useQuery(['commentsData'], async () => {
    const resp = await fetchCommentData(ticketId);
    return resp;
  });

  useEffect(() => {
    fetchCurrentUser().then(resp => setCurrentUser(resp));
    fetchAllTicketStatus().then(resp => setAllStatus(resp));
    fetchAllUsers().then(resp => setAllUsers(resp));
  }, []);

  const newCommentMutation = useMutation(async () => {
    const result = await submitTicketReply({
      title: replySubjectRef.current.value,
      description,
      ticket_id: ticketData.id,
      commenter_id: currentUser ? currentUser.id : currentUser,
    });
    if (result && result.id) {
      replySubjectRef.current.value = '';
      setDescription('');
      setIsReplyEditorOpen(false);
      await reFetchComment();
    } else {
      alert('Reply submit error');
    }
    return result;
  });
  const handleSendReply = () => {
    newCommentMutation.mutate();
  };

  const handleDeleteConfirmation = commentId => () => {
    setCommentDeleteConfirmation(true);
    setSelectedComment(commentId);
  };
  const commentDeleteMutation = useMutation(async () => {
    await deleteComment(selectedComment);
    setCommentDeleteConfirmation(false);
    await reFetchComment();
    setToastMessage('Comment deleted successfully');
    setShowToast(true);
  });
  const handleDeleteComment = async () => {
    commentDeleteMutation.mutate();
  };
  const ticketUpdateMutation = useMutation(async () => {
    const result = await ticketUpdate(ticketData.id, { status: newStatus, assignee_id: newAssignedToID });
    if (result.id) {
      await reFetchTicket();
      setToastMessage('Ticket updated successfully');
      setShowToast(true);
    } else if (result.base) {
      alert(result.base);
    }
  });
  const handleUpdateTicket = async () => {
    ticketUpdateMutation.mutate();
  };
  const ticketDeleteMutation = useMutation(async () => {
    const resp = await ticketDelete(ticketData.id);
    setTicketDeleteConfirmation(false);
    if (isEmpty(resp)) {
      setToastMessage('Ticket deleted successfully');
      setShowToast(true);
      window.history.back();
    }
  });
  const handleTicketDelete = async () => {
    ticketDeleteMutation.mutate();
  };
  if (isTicketLoading) return <Container>Loading ...</Container>;
  return (
    <Container>
      <ToastNotification show={showToast} setShow={setShowToast} message={toastMessage} />
      <ConfirmationDialog
        show={ticketDeleteConfirmation}
        setShow={setTicketDeleteConfirmation}
        onCancel={() => setTicketDeleteConfirmation(false)}
        onSubmit={handleTicketDelete}
        title={'Are you sure?'}
        body={'Ticket and its comments will be deleted permanently.'}
        okButtonLabel={'Confirm'}
        loading={ticketDeleteMutation.isLoading}
      />
      <ConfirmationDialog
        show={commentDeleteConfirmation}
        setShow={setCommentDeleteConfirmation}
        onCancel={() => setCommentDeleteConfirmation(false)}
        onSubmit={handleDeleteComment}
        title={'Are you sure?'}
        body={'Comment will be deleted permanently.'}
        okButtonLabel={'Confirm'}
        loading={commentDeleteMutation.isLoading}
      />
      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5>
                <FileText className={'mr-1'} />
                {ticketData.subject}
              </h5>
            </Card.Header>
            <Card.Body className="border-bottom">
              <Row className="align-items-center">
                <Col md={8}>
                  <h6 className="d-inline-block mb-0" dangerouslySetInnerHTML={{ __html: ticketData.description }} />
                </Col>
                <Col md={4}></Col>
              </Row>
            </Card.Body>

            {isCommentLoading
              ? 'Loading Comments ...'
              : commentsData.map(comment => (
                  <Card.Body key={comment.id} className="hd-detail hdd-admin border-bottom">
                    <Row>
                      <Col sm="auto">
                        <p>
                          <i className="fas fa-thumbs-up mr-1 text-primary" />#{comment.id}
                        </p>
                      </Col>
                      <Col>
                        <div className="comment-top">
                          <h4>
                            {comment.commenter_name} <small className="text-muted f-w-400">replied</small>
                          </h4>
                          <p>{new Date(comment.created_at).toUTCString()}</p>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: comment.description }}></div>
                      </Col>
                      <Col sm="auto" className="pl-0 col-right">
                        <Card.Body className="text-center">
                          <ul className="list-unstyled mb-0 edit-del">
                            <li className="d-inline-block f-20 mr-1">
                              <span>
                                <Edit2 className={'text-muted'} style={{ cursor: 'pointer' }} />
                              </span>
                            </li>
                            <li className="d-inline-block f-20">
                              <span>
                                <Trash2 className={'text-muted'} style={{ cursor: 'pointer' }} onClick={handleDeleteConfirmation(comment.id)} />
                              </span>
                            </li>
                          </ul>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card.Body>
                ))}
            <div className="bg-light p-3">
              <Row className="align-items-center">
                <Col>
                  <Button
                    variant="secondary"
                    className={'text-uppercase'}
                    onClick={() => {
                      setIsReplyEditorOpen(!isReplyEditorOpen);
                    }}
                  >
                    <MessageSquare className={'mr-2'} />
                    Post a reply
                  </Button>
                </Col>
              </Row>
            </div>
            {isReplyEditorOpen && (
              <Form>
                <Card>
                  <Card.Body>
                    <Card.Title>Reply:</Card.Title>
                    <Row>
                      <Col sm={12}>
                        <Form.Group controlId="formSubject">
                          <Form.Label>Subject</Form.Label>
                          <Form.Control type="text" placeholder="Subject" ref={replySubjectRef} />
                        </Form.Group>
                      </Col>
                      <Col sm={12}>
                        <Form.Group controlId="formReply">
                          <Form.Label>Description:</Form.Label>
                          <JoditEditor key={2} value={description} config={config as any} onBlur={setDescription} />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div>
                      <LoadingButton variant="success" onClick={handleSendReply} loading={newCommentMutation.isLoading}>
                        Send
                      </LoadingButton>{' '}
                      <Button variant="secondary" onClick={() => setIsReplyEditorOpen(!isReplyEditorOpen)}>
                        Cancel
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Form>
            )}
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="hdd-right-inner">
            <Card.Header>
              <h5>Ticket Details</h5>
            </Card.Header>
            <Card.Body>
              {!isCommentLoading && !!commentsData.length && (
                <div className="alert alert-success d-block text-center text-uppercase">
                  <CheckCircle className={'mr-2'} />
                  Replied
                </div>
              )}
              <Form.Group controlId="ticketEdit.changeStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control as="select" custom value={newStatus} onChange={event => setNewStatus(event.target.value)}>
                  {allStatus.map(op => {
                    return (
                      <option key={op.id} value={op.id}>
                        {op.label}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="ticketEdit.changeAssignedTo">
                <Form.Label>Assigned To</Form.Label>
                <Form.Control as="select" custom value={newAssignedToID} onChange={event => setNewAssignedToID(event.target.value)}>
                  {allUsers.map(user => {
                    return (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
            </Card.Body>
            <Container>
              <Row>
                <Col sm={3}>
                  <label>Name:</label>
                </Col>
                <Col sm={9}>
                  <span>{ticketData.name}</span>
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <label>Email:</label>
                </Col>
                <Col sm={9}>
                  <span>{ticketData.email}</span>
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <label className="mb-0 wid-100 mr-2">Created:</label>
                </Col>
                <Col sm={9}>
                  <span>{new Date(ticketData.created_at).toUTCString()}</span>
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <label className="mb-0 wid-100 mr-2">Response:</label>
                </Col>
                <Col sm={9}>
                  <span>{new Date(ticketData.updated_at).toUTCString()}</span>
                </Col>
              </Row>
            </Container>
            <ul className="list-group list-group-flush">
              <li className="list-group-item py-3">
                <LoadingButton onClick={handleUpdateTicket} loading={ticketUpdateMutation.isLoading}>
                  <Save className={'mr-2'} />
                  Update
                </LoadingButton>{' '}
                <LoadingButton onClick={() => setTicketDeleteConfirmation(true)} loading={ticketDeleteMutation.isLoading} variant={'danger'}>
                  {' '}
                  <Trash2 className={'mr-2'} />
                  Delete Ticket
                </LoadingButton>
              </li>
            </ul>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default TicketEdit;
