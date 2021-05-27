import * as React from 'react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { CheckCircle, FileText, Save, Trash2 } from 'react-feather';
import { useMutation, useQuery } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { fetchAllTicketStatus, fetchTicketData, ticketDelete, ticketUpdate } from '../../../services/serviceTicket';
import { fetchCommentData } from '../../../services/serviceComment';
import { fetchAllUsers } from '../../../services/serviceUser';
import { ConfirmationDialog } from '../../../components/ConfirmationDialog';
import { LoadingButton } from '../../../components/LoadingButton';
import { isEmptyObject } from '../../utils';
import { CommentItem } from './CommentItem';
import { SpinnerModal } from '../../../components/SpinnerModal';
import { Select } from '../../../components/select/Select';
import { Card, CardBody, CardHeader } from '../../../components/card/Card';
import styles from './TicketEdit.module.scss';

interface TicketEditProps {
  ticketId: string;
}

export const TicketEdit = (props: TicketEditProps) => {
  const [allStatus, setAllStatus] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [newStatus, setNewStatus] = useState('open');
  const [newAssignedToID, setNewAssignedToID] = useState<'' | number>('');
  const [ticketDeleteConfirmation, setTicketDeleteConfirmation] = useState(false);

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
    fetchAllTicketStatus().then(resp => setAllStatus(resp));
    fetchAllUsers().then(resp => setAllUsers(resp));
  }, []);

  const ticketUpdateMutation = useMutation(async () => {
    const result = await ticketUpdate(ticketData.id, { status: newStatus, assignee_id: newAssignedToID });
    if (result.id) {
      await reFetchTicket();
      toast('Ticket updated successfully');
    } else if (result.base) {
      alert(result.base);
    }
  });

  const handleUpdateTicket = () => {
    ticketUpdateMutation.mutate();
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

  const handleTicketDelete = () => {
    ticketDeleteMutation.mutate();
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

      {ticketData && (
        <Card className={styles.mainLayout}>
          <div className={styles.firstColumn}>
            <Card>
              <CardHeader>
                <div className={styles.title}>
                  <FileText className={styles.marginRight2} />
                  {ticketData.subject}
                </div>
              </CardHeader>
              <CardBody className={styles.borderBottom}>
                <p className={styles.description} dangerouslySetInnerHTML={{ __html: ticketData.description }} />
              </CardBody>
              <SpinnerModal loading={isCommentLoading} />
              {commentsData?.map(comment => (
                <CommentItem key={comment.id} comment={comment} editable={false} />
              ))}
            </Card>
          </div>
          <Card className={styles.secondColumn}>
            <Card>
              <CardHeader>
                <h5>Ticket Details</h5>
              </CardHeader>
              <CardBody>
                {!isCommentLoading && !!commentsData.length && (
                  <div className={clsx(styles.repliedContainer, 'custom-alert custom-alert-success')}>
                    <CheckCircle className={styles.marginRight2} />
                    Replied
                  </div>
                )}
                <div>
                  <table>
                    <tr>
                      <td>
                        <label>Status</label>
                      </td>
                      <td>
                        <Select value={newStatus} onChange={event => setNewStatus(event.target.value)}>
                          {allStatus.map(op => (
                            <option key={op.id} value={op.id}>
                              {op.label}
                            </option>
                          ))}
                        </Select>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Assigned To</label>
                      </td>
                      <td>
                        <Select value={newAssignedToID} onChange={event => setNewAssignedToID(parseInt(event.target.value, 10))}>
                          {allUsers.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.first_name} {user.last_name}
                            </option>
                          ))}
                        </Select>
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
                        <label>Created:</label>
                      </td>
                      <td>
                        <span>{new Date(ticketData.created_at).toUTCString()}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Response:</label>
                      </td>
                      <td>
                        <span>{new Date(ticketData.updated_at).toUTCString()}</span>
                      </td>
                    </tr>
                  </table>
                </div>
                <div className={styles.buttonGroup}>
                  <LoadingButton onClick={handleUpdateTicket} loading={ticketUpdateMutation.isLoading} className={styles.marginRight2}>
                    <Save className={styles.marginRight2} />
                    Update
                  </LoadingButton>
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
export default TicketEdit;
