import * as React from 'react';
import { useEffect, useState } from 'react';
import { Filter, Plus } from 'react-feather';
import { useMutation, useQuery } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CurrentUser, SearchState, SortDirection, SortState, Ticket } from '../../Types';
import { fetchAllTicketData, fetchAllTicketStatusFilter, fetchSentimentFilter, ticketDelete } from '../../../services/serviceTicket';
import { fetchCurrentUser } from '../../../services/serviceUser';
import { ConfirmationDialog } from '../../../components/dialog/ConfirmationDialog';
import { NewTicketModal } from './NewTicketModal';
import { TicketSearch } from './TicketSearch';
import { isEmptyObject } from '../../utils';
import { TicketTable } from './TicketTable';
import { TicketPagination } from './TicketPagination';
import { SpinnerModal } from '../../../components/spinner/SpinnerModal';
import { Button } from '../../../components/button/Button';
import { Card, CardBody, CardHeader } from '../../../components/card/Card';
import styles from './TicketList.module.scss';

const searchFormInitialState = {
  name: '',
  email: '',
  subject: '',
  description: '',
};

export const TicketList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(0);
  const [pageNo, setPageNo] = useState<number | string>(1);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [sortState, setSortState] = useState<SortState>({});
  const [searchState, setSearchState] = useState<SearchState>({ ...searchFormInitialState });
  const [searchSubmitState, setSearchSubmitState] = useState<SearchState>({} as SearchState);
  const [status, setStatus] = useState<number | string>('');
  const [sentiment, setSentiment] = useState<number | string>('');
  const [statusSubmit, setStatusSubmit] = useState<number | string>('');
  const [sentimentSubmit, setSentimentSubmit] = useState<number | string>('');
  const [statusOptions, setStatusOptions] = useState([]);
  const [sentimentOptions, setSentimentOptions] = useState([]);
  const [isCollapseOpen, setIsCollapseOpen] = React.useState(false);

  useEffect(() => {
    fetchCurrentUser().then(resp => setCurrentUser(resp));
  }, []);

  const {
    isLoading,
    error,
    data: ticketData,
    refetch,
    isFetching,
  } = useQuery(['ticketsData'], () => fetchAllTicketData(pageNo, sortState, searchSubmitState, statusSubmit, sentimentSubmit), {
    enabled: false,
    keepPreviousData: true,
  });

  useEffect(() => {
    refetch();
  }, [pageNo, sortState, searchSubmitState, statusSubmit]);

  useEffect(() => {
    fetchAllTicketStatusFilter().then(resp => setStatusOptions(resp));
  }, []);

  useEffect(() => {
    fetchSentimentFilter().then(resp => setSentimentOptions(resp));
  }, []);

  const onTicketDeleteConfirm = (ticketId: number) => () => {
    setDeleteConfirmation(true);
    setSelectedTicket(ticketId);
  };

  const onTicketConfirmCancel = () => setDeleteConfirmation(false);

  const ticketDeleteMutation = useMutation(async () => {
    const resp = await ticketDelete(selectedTicket);
    setDeleteConfirmation(false);
    if (isEmptyObject(resp)) {
      await refetch();
      toast('Ticket deleted successfully');
    }
    return resp;
  });

  const onTicketDelete = () => ticketDeleteMutation.mutate();

  const onNewTicket = (ticket: Ticket) => {
    setSearchState({ ...searchFormInitialState });
    refetch();
    toast('Ticket created successfully');
  };

  const handlePageChange = (page_number: number | string) => () => setPageNo(page_number);

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
    setSentimentSubmit(sentiment);
  };

  const handleClearSearchForm = () => {
    setPageNo(1);
    setSearchState({ ...searchFormInitialState });
    setStatus('');
    setSentiment('');
    setStatusSubmit('');
    setSentimentSubmit('');
    setSearchSubmitState({} as SearchState);
  };

  return (
    <div className={styles.container}>
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

      <Card>
        <CardHeader>
          <div className={styles.titleRow}>
            <div>
              <h5 className={styles.title}>All Tickets</h5>
            </div>
            <div>
              <Button type="button" className={styles.filterButton} onClick={() => setIsCollapseOpen(prevState => !prevState)}>
                <Filter />
                Filter
              </Button>
              <Button type="button" onClick={() => setIsOpen(true)}>
                <Plus /> Add Ticket
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          {isCollapseOpen && (
            <Card>
              <CardBody>
                <TicketSearch
                  searchConfig={{
                    searchState: searchState,
                    setSearchState: setSearchState,
                  }}
                  statusConfig={{
                    status: status,
                    setStatus: setStatus,
                    statusOptions: statusOptions,
                  }}
                  sentimentConfig={{
                    sentiment: sentiment,
                    setSentiment: setSentiment,
                    sentimentOptions: sentimentOptions,
                  }}
                  onSubmit={handleSearchSubmit}
                  loading={isLoading || isFetching}
                  onReset={handleClearSearchForm}
                />
              </CardBody>
            </Card>
          )}

          <Card className={styles.tableContainer}>
            <CardBody>
              <SpinnerModal loading={isLoading || isFetching} />
              {ticketData && (
                <>
                  <TicketTable sortState={sortState} handleOnSortClick={handleOnSortClick} ticketData={ticketData} onTicketDeleteConfirm={onTicketDeleteConfirm} />
                  <TicketPagination ticketData={ticketData} handlePageChange={handlePageChange} />
                </>
              )}
            </CardBody>
          </Card>
        </CardBody>
      </Card>
      {currentUser && <NewTicketModal show={isOpen} onHide={() => setIsOpen(false)} onNewTicket={onNewTicket} currentUser={currentUser} />}
    </div>
  );
};
