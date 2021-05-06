import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Plus } from 'react-feather';
import clsx from 'clsx';
import { useMutation, useQuery } from 'react-query';
import { CurrentUser, SearchState, SortDirection, SortState, Ticket } from '../../Types';
import { fetchAllTicketData, fetchAllTicketStatusFilter, ticketDelete } from '../../../services/serviceTicket';
import { fetchCurrentUser } from '../../../services/serviceUser';
import { ToastNotification } from '../../../components/ToastNotification';
import { ConfirmationDialog } from '../../../components/ConfirmationDialog';
import { NewTicketModal } from './NewTicketModal';
import { TicketSearch } from './TicketSearch';
import { isEmpty } from '../../utils';
import { TicketTable } from './TicketTable';
import { TicketPagination } from './TicketPagination';
import styles from './TicketList.module.scss';

const searchFormInitialState = () => ({
  name: '',
  email: '',
  subject: '',
  description: '',
});
export const TicketList = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [pageNo, setPageNo] = useState<number | string>(1);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [sortState, setSortState] = useState<SortState>({});
  const [searchState, setSearchState] = useState<SearchState>(searchFormInitialState());
  const [status, setStatus] = useState<number | string>('');
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    fetchCurrentUser().then(resp => setCurrentUser(resp));
  }, []);

  const { isLoading, error, data: ticketData, refetch, isFetching } = useQuery(['ticketsData', pageNo, sortState], () =>
    fetchAllTicketData(pageNo, sortState, searchState, status),
  );

  useEffect(() => {
    fetchAllTicketStatusFilter().then(resp => {
      setStatusOptions(resp);
    });
  }, []);

  const onTicketDeleteConfirm = (ticketId: number) => () => {
    setDeleteConfirmation(true);
    setSelectedTicket(ticketId);
  };

  const onTicketConfirmCancel = () => {
    setDeleteConfirmation(false);
  };
  const ticketDeleteMutation = useMutation(async () => {
    const resp = await ticketDelete(selectedTicket);
    setDeleteConfirmation(false);
    if (isEmpty(resp)) {
      await refetch();
      setToastMessage('Ticket deleted successfully');
      setShowToast(true);
    }
    return resp;
  });
  const onTicketDelete = async () => {
    ticketDeleteMutation.mutate();
  };

  const onNewTicket = (ticket: Ticket) => {
    setSearchState(searchFormInitialState());
    refetch();
    setToastMessage('Ticket created successfully');
    setShowToast(true);
  };

  const handlePageChange = (page_number: number | string) => () => {
    setPageNo(page_number);
  };

  const handleOnSortClick = (column_id: string, order?: SortDirection) => (e?: React.MouseEvent) => {
    setPageNo(1);
    setSortState(prevState => {
      const sortOrder = sortState[column_id];
      const newSortState = !e || !e.ctrlKey ? {} : { ...prevState };
      if (order !== undefined) {
        // when clicked from context menu
        return { ...newSortState, [column_id]: order };
      } else {
        if (sortOrder === null || sortOrder === undefined || sortOrder === SortDirection.None) {
          return { ...newSortState, [column_id]: SortDirection.Ascending };
        } else if (sortOrder === SortDirection.Ascending) {
          return { ...newSortState, [column_id]: SortDirection.Descending };
        } else {
          delete newSortState[column_id];
          return newSortState;
        }
      }
    });
  };
  const handleSearchSubmit = () => {
    refetch();
  };
  const handleClearSearchForm = () => {
    setSearchState(searchFormInitialState());
    setStatus('');
  };
  return (
    <Container>
      <ToastNotification show={showToast} setShow={setShowToast} message={toastMessage} />
      <ConfirmationDialog
        show={deleteConfirmation}
        setShow={setDeleteConfirmation}
        onCancel={onTicketConfirmCancel}
        onSubmit={onTicketDelete}
        title={'Are you sure?'}
        body={'Ticket and its comments will be deleted permanently.'}
        okButtonLabel={'Confirm'}
        loading={ticketDeleteMutation.isLoading}
      />
      {currentUser && <NewTicketModal show={isOpen} onHide={() => setIsOpen(false)} onNewTicket={onNewTicket} currentUser={currentUser} />}
      <Row>
        <Col sm={12}>
          <Card className="shadow-none">
            <Card.Header>
              <Row>
                <Col sm={6}>
                  <h5>All Tickets</h5>
                </Col>
                <Col sm={6} className="text-right">
                  <Button variant="success" className="btn-sm btn-round has-ripple" onClick={() => setIsOpen(true)}>
                    <Plus /> Add Ticket
                  </Button>
                </Col>
              </Row>
            </Card.Header>

            <Card.Body className={clsx(['shadow border-0', styles['support-table']])}>
              <Card>
                <Card.Header>Filter</Card.Header>
                <Card.Body>
                  <TicketSearch
                    searchState={searchState}
                    setSearchState={setSearchState}
                    status={status}
                    setStatus={setStatus}
                    statusOptions={statusOptions}
                    onSubmit={handleSearchSubmit}
                    loading={isLoading || isFetching}
                    onReset={handleClearSearchForm}
                  />
                </Card.Body>
              </Card>
              <Card className={'mt-3'}>
                <Card.Body>
                  {isLoading || isFetching ? (
                    'Loading...'
                  ) : (
                    <TicketTable sortState={sortState} handleOnSortClick={handleOnSortClick} ticketData={ticketData} onTicketDeleteConfirm={onTicketDeleteConfirm} />
                  )}
                  {(!isLoading || !isFetching) && <TicketPagination ticketData={ticketData} handlePageChange={handlePageChange} />}
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default TicketList;
