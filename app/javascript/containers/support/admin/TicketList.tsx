import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Pagination, Row, Table } from 'react-bootstrap';
import { Edit, Plus, Trash2 } from 'react-feather';
import clsx from 'clsx';
import { useQuery } from 'react-query';
import { CurrentUser, Pagy, SearchState, SortDirection, SortState, Ticket } from './TicketTypes';
import { fetchAllTicketData, fetchAllTicketStatusFilter, ticketDelete } from './serviceTicket';
import { fetchCurrentUser } from './serviceUser';
import { ToastNotification } from './ToastNotification';
import { ConfirmationDialog } from './ConfirmationDialog';
import { NewTicketModal } from './NewTicketModal';
import styles from './TicketList.module.scss';
import { TicketSearch } from './TicketSearch';

interface TicketItemProps {
  ticket: Ticket;
  onDelete: () => void;
}

export const TicketItem = (props: TicketItemProps) => {
  return (
    <>
      <td>{props.ticket.name}</td>
      <td>{props.ticket.email}</td>
      <td className={'text-truncate'} style={{ maxWidth: 300 }}>
        {props.ticket.subject}
      </td>
      <td className={'text-truncate'} style={{ maxWidth: 300 }}>
        {props.ticket.description}
      </td>
      <td>{props.ticket.assignee_name}</td>
      <td>{props.ticket.status}</td>
      <td>{new Date(props.ticket.created_at).toUTCString()}</td>
      <td>{new Date(props.ticket.updated_at).toUTCString()}</td>
      {/*<td>Url: {props.ticket.url}</td>*/}
      <td style={{ display: 'flex', flexWrap: 'nowrap' }}>
        <a href={`tickets/${props.ticket.id}/edit`} className="text-muted">
          <Edit className={'mr-1'} />
        </a>
        <Trash2 style={{ cursor: 'pointer' }} onClick={props.onDelete} />
      </td>
    </>
  );
};

function TicketTable(props: {
  sortState: SortState;
  handleOnSortClick: (column_id: string, order?: SortDirection) => (e?: React.MouseEvent) => void;
  ticketData: { data: Ticket[]; pagy: Pagy };
  onTicketDeleteConfirm: (ticketId: number) => () => void;
}) {
  const { sortState, handleOnSortClick, onTicketDeleteConfirm } = props;
  const SortIcon = (p: { id: string }) => {
    if (sortState[p.id] === SortDirection.Ascending) return <>▲</>;
    if (sortState[p.id] === SortDirection.Descending) return <>▼</>;
    return <></>;
  };
  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th className="border-top-0" onClick={handleOnSortClick('name')}>
            Name <SortIcon id={'name'} />
          </th>
          <th className="border-top-0" onClick={handleOnSortClick('email')}>
            Email <SortIcon id={'email'} />
          </th>
          <th className="border-top-0" onClick={handleOnSortClick('subject')}>
            Subject <SortIcon id={'subject'} />
          </th>
          <th className="border-top-0" onClick={handleOnSortClick('description')}>
            Description <SortIcon id={'description'} />
          </th>
          <th className="border-top-0" style={{ whiteSpace: 'nowrap' }} onClick={handleOnSortClick('assignee_id')}>
            Assigned to <SortIcon id={'assignee_id'} />
          </th>
          <th className="border-top-0" style={{ whiteSpace: 'nowrap' }} onClick={handleOnSortClick('status')}>
            Status <SortIcon id={'status'} />
          </th>
          <th className="border-top-0" onClick={handleOnSortClick('created_at')}>
            Created <SortIcon id={'created_at'} />
          </th>
          <th className="border-top-0" style={{ whiteSpace: 'nowrap' }} onClick={handleOnSortClick('updated_at')}>
            Last Activity <SortIcon id={'updated_at'} />
          </th>
          <th className="border-top-0">Actions</th>
        </tr>
      </thead>
      <tbody>
        {props.ticketData.data.map(item => {
          return (
            <tr key={item.id}>
              <TicketItem ticket={item} onDelete={onTicketDeleteConfirm(item.id)} />
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

const TicketPagination = (props: { handlePageChange: (page_number: number | string) => () => void; ticketData: { data: Ticket[]; pagy: Pagy } }) => {
  const { ticketData, handlePageChange } = props;
  return (
    <div className="pagination-block text-center">
      <nav aria-label="Page navigation example" className="d-inline-block">
        <Pagination>
          {/*@ts-ignore*/}
          <Pagination.First onClick={handlePageChange(1)} disabled={!props.ticketData.pagy.prev} />
          {/*@ts-ignore*/}
          <Pagination.Prev onClick={handlePageChange(ticketData.pagy.prev)} disabled={!props.ticketData.pagy.prev} />
          {(props.ticketData.pagy.series || []).map(x => {
            if (typeof x == 'string' && x != 'gap')
              return (
                <Pagination.Item key={x} active onClick={handlePageChange(x)}>
                  {x}
                </Pagination.Item>
              );
            if (typeof x == 'number')
              return (
                <Pagination.Item key={x} onClick={handlePageChange(x)}>
                  {x}
                </Pagination.Item>
              );
            if (x == 'gap') return <Pagination.Ellipsis key={x} disabled />;
            return <div key={x}>Error</div>;
          })}
          {/*@ts-ignore*/}
          <Pagination.Next onClick={handlePageChange(ticketData.pagy.next)} disabled={!props.ticketData.pagy.next} />
          {/*@ts-ignore*/}
          <Pagination.Last onClick={handlePageChange(ticketData.pagy.last)} disabled={!props.ticketData.pagy.last || !props.ticketData.pagy.next} />
        </Pagination>
      </nav>
    </div>
  );
};
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

  const onTicketDelete = async () => {
    setDeleteConfirmation(false);
    await ticketDelete(selectedTicket).then(resp => {
      if (!resp.error) {
        refetch();
        setToastMessage('Ticket deleted successfully');
        setShowToast(true);
      }
    });
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
