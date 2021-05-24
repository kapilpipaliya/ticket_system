import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { CheckCircle, Edit2, FileText, MessageSquare, Trash2 } from 'react-feather';
import { useMutation, useQuery } from 'react-query';
import { fetchTicketData, ticketDelete } from '../../../services/serviceTicket';
import { deleteComment, fetchCommentData, submitTicketReply } from '../../../services/serviceComment';
import { fetchAllUsers, fetchCurrentUser } from '../../../services/serviceUser';
import { ConfirmationDialog } from '../../../components/ConfirmationDialog';
import { LoadingButton } from '../../../components/LoadingButton';
import { isEmpty } from '../../utils';
import { Spinner } from '../../../components/Spinner';
import { CommentItem } from '../ticket_edit/CommentItem';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NewComponentForm } from '../ticket_edit/NewComponentForm';
import { CommentType, CurrentUser } from '../../Types';

interface TicketViewProps {
  ticketId: string;
}

export const TicketView = (props: TicketViewProps) => {
  const [allUsers, setAllUsers] = useState([]);
  const [newStatus, setNewStatus] = useState('open');
  const [newAssignedToID, setNewAssignedToID] = useState<'' | number>('');
  const [ticketDeleteConfirmation, setTicketDeleteConfirmation] = useState(false);
  const [commentDeleteConfirmation, setCommentDeleteConfirmation] = useState(false);
  const [selectedComment, setSelectedComment] = useState(0);
  const [isReplyEditorOpen, setIsReplyEditorOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const {
    isLoading: isTicketLoading,
    error: ticketError,
    data: ticketData,
    isFetching,
    refetch: reFetchTicket,
  } = useQuery(
    'ticketData',
    async () => {
      const resp = await fetchTicketData(props.ticketId);
      setNewStatus(resp.status);
      setNewAssignedToID(resp.assignee_id || '');
      return resp;
    },
    {
      enabled: false,
      keepPreviousData: true,
    },
  );

  const {
    isLoading: isCommentLoading,
    error: commentError,
    data: commentsData,
    refetch: reFetchComment,
  } = useQuery(
    'commentsData',
    async () => {
      return await fetchCommentData(props.ticketId);
    },
    {
      enabled: false,
      keepPreviousData: true,
    },
  );

  useEffect(() => {
    reFetchTicket();
    reFetchComment();
    fetchCurrentUser().then(resp => setCurrentUser(resp));
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
  const commentDeleteMutation = useMutation(async () => {
    const result = await deleteComment(selectedComment);
    setCommentDeleteConfirmation(false);
    if (result.base) {
      alert(result.base);
    } else {
      await reFetchComment();
      toast('Comment deleted successfully');
    }
  });
  const handleDeleteComment = async () => {
    commentDeleteMutation.mutate();
  };
  const handleDeleteConfirmation = commentId => () => {
    setCommentDeleteConfirmation(true);
    setSelectedComment(commentId);
  };
  const ticketDeleteMutation = useMutation(async () => {
    const resp = await ticketDelete(ticketData.id);
    setTicketDeleteConfirmation(false);
    if (isEmpty(resp)) {
      toast('Ticket deleted successfully');
      window.location.href = '/tickets';
    }
    return resp;
  });

  const handleTicketDelete = async () => {
    ticketDeleteMutation.mutate();
  };

  const displayUserName = id => {
    const user = allUsers.find(x => x.id == id);
    return user ? `${user.first_name} ${user.last_name}` : '';
  };

  if (isTicketLoading || isFetching || !ticketData)
    return (
      <Container className={'mt-2'}>
        <Spinner />
      </Container>
    );

  return (
    <Container className={'mt-2'}>
      <ToastContainer />
      <ConfirmationDialog
        show={ticketDeleteConfirmation}
        setShow={setTicketDeleteConfirmation}
        onCancel={() => setTicketDeleteConfirmation(false)}
        onSubmit={handleTicketDelete}
        title={'Are you sure?'}
        body={'Ticket and its comments will be deleted permanently.'}
        okButtonLabel={'Confirm'}
        loading={ticketDeleteMutation.isLoading}
        variant="danger"
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
        variant="danger"
      />
      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5>
                <FileText className={'me-1'} />
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

            {isCommentLoading ? (
              <Spinner />
            ) : (
              commentsData.map(comment => {
                return (
                  <CommentItem
                    key={comment.id}
                    ticketId={ticketData.id}
                    currentUser={currentUser}
                    reFetchComment={reFetchComment}
                    comment={comment}
                    onClick={handleDeleteConfirmation(comment.id)}
                    editable={true}
                  />
                );
              })
            )}
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
                    <MessageSquare className={'me-2'} />
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
                  <CheckCircle className={'me-2'} />
                  Replied
                </div>
              )}
            </Card.Body>
            <Container>
              <Row>
                <Col sm={3}>
                  <label>Status:</label>
                </Col>
                <Col sm={9}>
                  <span>{newStatus}</span>
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <label>Assignee:</label>
                </Col>
                <Col sm={9}>
                  <span>{displayUserName(newAssignedToID)}</span>
                </Col>
              </Row>
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
                  <label className="mb-0 wid-100 me-2">Created:</label>
                </Col>
                <Col sm={9}>
                  <span>{new Date(ticketData.created_at).toUTCString()}</span>
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <label className="mb-0 wid-100 me-2">Response:</label>
                </Col>
                <Col sm={9}>
                  <span>{new Date(ticketData.updated_at).toUTCString()}</span>
                </Col>
              </Row>
            </Container>
            <ul className="list-group list-group-flush">
              <li className="list-group-item py-3">
                <Button href={`/tickets/${props.ticketId}/edit`} className={'me-2'}>
                  <Edit2 className={'me-2'} />
                  Edit
                </Button>
                <LoadingButton onClick={() => setTicketDeleteConfirmation(true)} loading={ticketDeleteMutation.isLoading} variant={'danger'}>
                  <Trash2 className={'me-2'} />
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
export default TicketView;
