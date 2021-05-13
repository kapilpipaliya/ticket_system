import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { CheckCircle, Edit2, FileText, Trash2 } from 'react-feather';
import { useMutation, useQuery } from 'react-query';
import { fetchTicketData, ticketDelete } from '../../../services/serviceTicket';
import { fetchCommentData } from '../../../services/serviceComment';
import { fetchAllUsers } from '../../../services/serviceUser';
import { ConfirmationDialog } from '../../../components/ConfirmationDialog';
import * as UrlPattern from 'url-pattern';
import { LoadingButton } from '../../../components/LoadingButton';
import { isEmpty } from '../../utils';
import { Spinner } from '../../../components/Spinner';
import { CommentItem } from '../ticket_edit/CommentItem';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const TicketView = () => {
  const [ticketId] = useState(() => {
    const pattern = new UrlPattern('/tickets/(:id)');
    const matches = pattern.match(window.location.pathname);
    return matches.id;
  });
  const [allUsers, setAllUsers] = useState([]);
  const [newStatus, setNewStatus] = useState('open');
  const [newAssignedToID, setNewAssignedToID] = useState<'' | number>('');
  const [ticketDeleteConfirmation, setTicketDeleteConfirmation] = useState(false);

  const {
    isLoading: isTicketLoading,
    error: ticketError,
    data: ticketData,
    isFetching,
    refetch: reFetchTicket,
  } = useQuery(
    'ticketData',
    async () => {
      const resp = await fetchTicketData(ticketId);
      setNewStatus(resp.status);
      setNewAssignedToID(resp.assignee_id || '');
      return resp;
    },
    {
      enabled: false,
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
      return await fetchCommentData(ticketId);
    },
    {
      enabled: false,
    },
  );

  useEffect(() => {
    reFetchTicket();
    reFetchComment();
    fetchAllUsers().then(resp => setAllUsers(resp));
  }, []);

  const ticketDeleteMutation = useMutation(async () => {
    const resp = await ticketDelete(ticketData.id);
    setTicketDeleteConfirmation(false);
    if (isEmpty(resp)) {
      toast('Ticket deleted successfully');
      window.history.back();
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

  if (isTicketLoading)
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
                return <CommentItem key={comment.id} ticketId={ticketData.id} comment={comment} editable={false} />;
              })
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
                <Button href={`/tickets/${ticketId}/edit`} className={'me-2'}>
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
