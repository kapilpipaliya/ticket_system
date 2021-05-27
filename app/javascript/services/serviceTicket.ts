import { Pagy, SearchState, SortDirection, SortState, Ticket, TicketStatus } from '../containers/Types';
import { deleteApi, patch, post } from './apiFunctions';

const sortDirectionToString = (d: SortDirection) => {
  switch (d) {
    case SortDirection.Ascending:
      return 'asc';
    case SortDirection.Descending:
      return 'desc';
    case SortDirection.None:
      return '';
  }
};

const sortQuery = (sort_state: SortState) => {
  return Object.entries(sort_state)
    .map(([key, value]) => {
      if (value != SortDirection.None) {
        return 'q[s][]=' + key + ' ' + sortDirectionToString(value);
      } else {
        return '';
      }
    })
    .join('&');
};

const searchQuery = (sort_state: SearchState) => {
  return Object.entries(sort_state)
    .map(([key, value]) => {
      if (value) {
        return 'q[' + key + '_cont]=' + value;
      } else {
        return '';
      }
    })
    .join('&');
};

export const fetchAllTicketData = async (
  page_number: number | string,
  sort_state: SortState,
  search_state: SearchState,
  status: number | string,
  sentiment: number | string,
): Promise<{ data: Ticket[]; pagy: Pagy }> => {
  try {
    const search_query = searchQuery(search_state);
    const sort_query = sortQuery(sort_state);
    const response = await fetch(
      `/api/v1/tickets.json?page=${page_number}${search_query ? `&${search_query}` : ''}${sort_query ? `&${sort_query}` : ''}&q[status_eq]=${status}&q[sentiment_eq]=${sentiment}`,
    );
    return await response.json();
  } catch (err) {
    alert(err);
    return { data: [], pagy: {} as Pagy };
  }
};

export const ticketCreate = async (data: { [key: string]: any }) => {
  try {
    return await post('/api/v1/tickets', data);
  } catch (err) {
    alert(err);
    return {};
  }
};

export const getInitialTicketState = (): Ticket => {
  return {
    id: 0,
    subject: '',
    description: '',
    email: '',
    name: '',
    assignee_id: null,
    creator_id: null,
    status: 'open',
    created_at: '',
    updated_at: '',
    url: '',
    assignee_name: '',
  };
};

export const fetchTicketData = async (ticketId: string): Promise<Ticket> => {
  try {
    const response = await fetch(`/api/v1/tickets/${ticketId}.json`);
    return await response.json();
  } catch (err) {
    alert(err);
    return getInitialTicketState();
  }
};

export const ticketUpdate = async (ticketId, data: { [key: string]: any }) => {
  try {
    return await patch(`/api/v1/tickets/${ticketId}`, data);
  } catch (err) {
    alert(err);
    return {};
  }
};

export const fetchAllTicketStatus = async (): Promise<TicketStatus[]> => {
  try {
    const response = await fetch(`/api/v1/tickets/all_status.json`);
    return await response.json();
  } catch (err) {
    alert(err);
    return [];
  }
};

export const fetchAllTicketStatusFilter = async (): Promise<TicketStatus[]> => {
  try {
    const response = await fetch(`/api/v1/tickets/all_status_filter.json`);
    return await response.json();
  } catch (err) {
    alert(err);
    return [];
  }
};
export const fetchSentimentFilter = async (): Promise<TicketStatus[]> => {
  try {
    const response = await fetch(`/api/v1/tickets/sentiments_options_filter.json`);
    return await response.json();
  } catch (err) {
    alert(err);
    return [];
  }
};
export const ticketDelete = async ticketId => {
  try {
    const result = await deleteApi(`/api/v1/tickets/${ticketId}`);
    if (result.base) {
      alert(result.base);
    }
    return result;
  } catch (err) {
    alert(err);
  }
};

export const getInitialErrorState = () => {
  return {
    subject: [] as string[],
    name: [] as string[],
    email: [] as string[],
    description: [] as string[],
  };
};
