import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Collapse, Container, Modal, Row } from 'react-bootstrap';
import { Filter, Plus } from 'react-feather';
import { useMutation, useQuery } from 'react-query';
import { CurrentUser, SearchState, SortDirection, SortState, Ticket } from '../../Types';
import { fetchAllTicketData, fetchAllTicketStatusFilter, ticketDelete } from '../../../services/serviceTicket';
import { fetchCurrentUser } from '../../../services/serviceUser';

import { ConfirmationDialog } from '../../../components/ConfirmationDialog';
import { NewTicketModal } from './NewTicketModal';
import { TicketSearch } from './TicketSearch';
import { isEmpty } from '../../utils';
import { TicketTable } from './TicketTable';
import { TicketPagination } from './TicketPagination';
import { Spinner } from '../../../components/Spinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const [pageNo, setPageNo] = useState<number | string>(1);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [sortState, setSortState] = useState<SortState>({});
  const [searchState, setSearchState] = useState<SearchState>(searchFormInitialState());
  const [searchSubmitState, setSearchSubmitState] = useState<SearchState>({} as SearchState);
  const [status, setStatus] = useState<number | string>('');
  const [statusSubmit, setStatusSubmit] = useState<number | string>('');
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    fetchCurrentUser().then(resp => setCurrentUser(resp));
  }, []);

  const {
    isLoading,
    error,
    data: ticketData,
    refetch,
    isFetching,
  } = useQuery(['ticketsData'], () => fetchAllTicketData(pageNo, sortState, searchSubmitState, statusSubmit), {
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, [pageNo, sortState, searchSubmitState, statusSubmit]);

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
      toast('Ticket deleted successfully');
    }
    return resp;
  });
  const onTicketDelete = async () => {
    ticketDeleteMutation.mutate();
  };

  const onNewTicket = (ticket: Ticket) => {
    setSearchState(searchFormInitialState());
    refetch();
    toast('Ticket created successfully');
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
    setPageNo(1);
    setSearchSubmitState({ ...searchState });
    setStatusSubmit(status);
  };
  const handleClearSearchForm = () => {
    setPageNo(1);
    setSearchState(searchFormInitialState());
    setStatus('');
    setStatusSubmit('');
    setSearchSubmitState({} as SearchState);
  };
  const [isBasic, setIsBasic] = React.useState(false);
  return (
    <Container fluid className={'mt-2'}>
      <ToastContainer />
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
                <Col>
                  <h5>All Tickets</h5>
                </Col>
                <Col className="text-end">
                  <Button type="button" className={'btn-sm me-2'} onClick={() => setIsBasic(!isBasic)} aria-controls="basic-collapse" aria-expanded={isBasic}>
                    <Filter />
                    Filter
                  </Button>
                  <Button type="button" className="btn-sm" onClick={() => setIsOpen(true)}>
                    <Plus /> Add Ticket
                  </Button>
                </Col>
              </Row>
            </Card.Header>

            <Card.Body>
              <Collapse in={isBasic}>
                <Card>
                  <div id="basic-collapse">
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
                  </div>
                </Card>
              </Collapse>

              <Card className={'mt-3'}>
                <Card.Body>
                  {isLoading ||
                    (isFetching && (
                      <Modal show={true} centered animation={false} backdrop={false}>
                        <Card className={'text-center'}>
                          <Card.Body>
                            <Spinner />
                          </Card.Body>
                        </Card>
                      </Modal>
                    ))}
                  {ticketData && (
                    <>
                      <TicketTable sortState={sortState} handleOnSortClick={handleOnSortClick} ticketData={ticketData} onTicketDeleteConfirm={onTicketDeleteConfirm} />
                      <TicketPagination ticketData={ticketData} handlePageChange={handlePageChange} />
                    </>
                  )}
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
