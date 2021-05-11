import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { CommentType, CurrentUser } from '../../Types';
import { CheckCircle, FileText, MessageSquare, Save, Trash2 } from 'react-feather';
import { useMutation, useQuery } from 'react-query';
import { fetchAllTicketStatus, fetchTicketData, ticketDelete, ticketUpdate } from '../../../services/serviceTicket';
import { deleteComment, fetchCommentData, submitTicketReply } from '../../../services/serviceComment';
import { fetchAllUsers, fetchCurrentUser } from '../../../services/serviceUser';
import { ToastNotification } from '../../../components/ToastNotification';
import { ConfirmationDialog } from '../../../components/ConfirmationDialog';
import * as UrlPattern from 'url-pattern';
import { LoadingButton } from '../../../components/LoadingButton';
import { isEmpty } from '../../utils';
import { NewComponentForm } from './NewComponentForm';
import { CommentItem } from './CommentItem';

export const TicketEdit = () => {
  const [ticketId, setTicketId] = useState(() => {
    const pattern = new UrlPattern('/tickets/(:id)/edit');
    const matches = pattern.match(window.location.pathname);
    return matches.id;
  });
  const [isReplyEditorOpen, setIsReplyEditorOpen] = useState(false);
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

  const {
    isLoading: isTicketLoading,
    error: ticketError,
    data: ticketData,
    isFetching,
    refetch: reFetchTicket,
  } = useQuery('ticketData', async () => {
    const resp = await fetchTicketData(ticketId);
    setNewStatus(resp.status);
    setNewAssignedToID(resp.assignee_id || '');
    return resp;
  });

  const {
    isLoading: isCommentLoading,
    error: commentError,
    data: commentsData,
    refetch: reFetchComment,
  } = useQuery('commentsData', async () => {
    return await fetchCommentData(ticketId);
  });

  useEffect(() => {
    fetchCurrentUser().then(resp => setCurrentUser(resp));
    fetchAllTicketStatus().then(resp => setAllStatus(resp));
    fetchAllUsers().then(resp => setAllUsers(resp));
  }, []);

  const newCommentMutation = useMutation(async (data: any) => {
    const result = await submitTicketReply({
      description: data.description,
      ticket_id: ticketData.id,
      commenter_id: currentUser ? currentUser.id : currentUser,
    });
    if (result && result.id) {
      //replySubjectRef.current.value = '';
      //setDescription('');
      setIsReplyEditorOpen(false);
      await reFetchComment();
    } else {
      alert('Reply submit error');
    }
    return result;
  });

  const handleDeleteConfirmation = commentId => () => {
    setCommentDeleteConfirmation(true);
    setSelectedComment(commentId);
  };

  const commentDeleteMutation = useMutation(async () => {
    const result = await deleteComment(selectedComment);
    setCommentDeleteConfirmation(false);
    if (result.base) {
      alert(result.base);
    } else {
      await reFetchComment();
      setToastMessage('Comment deleted successfully');
      setShowToast(true);
    }
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
    return resp;
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
              : commentsData.map(comment => {
                  return (
                    <CommentItem
                      key={comment.id}
                      ticketId={ticketData.id}
                      currentUser={currentUser}
                      reFetchComment={reFetchComment}
                      comment={comment}
                      onClick={handleDeleteConfirmation(comment.id)}
                    />
                  );
                })}
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
              <NewComponentForm
                key={2}
                comment={{ description: '' } as CommentType}
                onSubmit={newCommentMutation.mutate}
                errors={{ description: [] }}
                loading={newCommentMutation.isLoading}
                toggleComment={() => setIsReplyEditorOpen(!isReplyEditorOpen)}
              />
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
