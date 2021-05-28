import * as React from 'react';
import { useEffect, useState } from 'react';
import { CheckCircle, Edit2, FileText, MessageSquare, Trash2 } from 'react-feather';
import { useMutation, useQuery } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import clsx from 'clsx';

import { fetchTicketData, ticketDelete } from '../../../services/serviceTicket';
import { deleteComment, fetchCommentData, submitTicketReply } from '../../../services/serviceComment';
import { fetchAllUsers, fetchCurrentUser } from '../../../services/serviceUser';
import { ConfirmationDialog } from '../../../components/dialog/ConfirmationDialog';
import { LoadingButton } from '../../../components/button/LoadingButton';
import { getLocalTimeDate, isEmptyObject } from '../../utils';
import { CommentItem } from '../ticket_edit/CommentItem';
import { NewComponentForm } from '../ticket_edit/NewComponentForm';
import { CommentType, CurrentUser } from '../../Types';
import { SpinnerModal } from '../../../components/spinner/SpinnerModal';
import { Button } from '../../../components/button/Button';
import { Card, CardBody, CardHeader } from '../../../components/card/Card';
import styles from '../ticket_edit/TicketEdit.module.scss';

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
  const { ticketId } = props;

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
      return await fetchCommentData(ticketId);
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

  const handleDeleteComment = async () => commentDeleteMutation.mutate();

  const handleDeleteConfirmation = commentId => () => {
    setCommentDeleteConfirmation(true);
    setSelectedComment(commentId);
  };

  const ticketDeleteMutation = useMutation(async () => {
    const resp = await ticketDelete(ticketData.id);
    setTicketDeleteConfirmation(false);
    if (isEmptyObject(resp)) {
      toast('Ticket deleted successfully');
      window.location.href = '/tickets';
    }
    return resp;
  });

  const handleTicketDelete = async () => ticketDeleteMutation.mutate();

  const displayUserName = id => {
    const user = allUsers.find(x => x.id == id);
    return user ? `${user.first_name} ${user.last_name}` : '';
  };

  return (
    <div className={styles.container}>
      <SpinnerModal loading={isTicketLoading || isFetching || (!ticketData && !commentsData)} />
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
      {ticketData && (
        <Card className={styles.mainLayout}>
          <Card className={styles.firstColumn}>
            <Card>
              <CardHeader>
                <h5>
                  <FileText className={'me-1'} />
                  {ticketData.subject}
                </h5>
              </CardHeader>
              <CardBody className={styles.borderBottom}>
                <p dangerouslySetInnerHTML={{ __html: ticketData.description }} />
              </CardBody>

              <SpinnerModal loading={isCommentLoading} />
              {commentsData?.map(comment => (
                <CommentItem key={comment.id} reFetchComment={reFetchComment} comment={comment} onClick={handleDeleteConfirmation(comment.id)} editable={true} />
              ))}
              <div className={styles.buttonGroup}>
                <div>
                  <Button variant="secondary" onClick={() => setIsReplyEditorOpen(!isReplyEditorOpen)}>
                    <MessageSquare className={styles.marginRight2} />
                    Post a reply
                  </Button>
                </div>
              </div>
              {isReplyEditorOpen && (
                <NewComponentForm
                  key={2}
                  comment={{ description: '' } as CommentType}
                  onSubmit={newCommentMutation.mutate}
                  errors={{ description: [] }}
                  loading={newCommentMutation.isLoading}
                  toggleComment={() => setIsReplyEditorOpen(prevState => !prevState)}
                />
              )}
            </Card>
          </Card>
          <Card className={styles.secondColumn}>
            <Card>
              <CardHeader>
                <h5>Ticket Details</h5>
              </CardHeader>
              <CardBody>
                {!isCommentLoading && !!commentsData.length && (
                  <div className="alert alert-success d-block text-center text-uppercase">
                    <CheckCircle className={styles.marginRight2} />
                    Replied
                  </div>
                )}
                <div>
                  <table>
                    <tr>
                      <td>
                        <label>Status:</label>
                      </td>
                      <td>
                        <span>{newStatus}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Assignee:</label>
                      </td>
                      <td>
                        <span>{displayUserName(newAssignedToID)}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Name:</label>
                      </td>
                      <td>
                        <span>{ticketData.name}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Email:</label>
                      </td>
                      <td>
                        <span>{ticketData.email}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className="mb-0 wid-100 me-2">Created:</label>
                      </td>
                      <td>
                        <span>{getLocalTimeDate(new Date(ticketData.created_at))}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className="mb-0 wid-100 me-2">Response:</label>
                      </td>
                      <td>
                        <span>{getLocalTimeDate(new Date(ticketData.updated_at))}</span>
                      </td>
                    </tr>
                  </table>
                </div>
                <div className={styles.buttonGroup}>
                  <a href={`/tickets/${ticketId}/edit`} className={clsx(styles.editButton, styles.marginRight2)}>
                    <Edit2 className={styles.marginRight2} />
                    Edit
                  </a>
                  <LoadingButton onClick={() => setTicketDeleteConfirmation(true)} loading={ticketDeleteMutation.isLoading} variant={'danger'}>
                    <Trash2 className={styles.marginRight2} />
                    Delete Ticket
                  </LoadingButton>
                </div>
              </CardBody>
            </Card>
          </Card>
        </Card>
      )}
    </div>
  );
};
