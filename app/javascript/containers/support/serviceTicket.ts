import { Pagy, Ticket, TicketStatus } from './TicketTypes';

export const fetchAllTicketData = async (page_number: number | string): Promise<{ data: Ticket[]; pagy: Pagy }> => {
  try {
    const response = await fetch(`/tickets.json?page=${page_number}`);
    return await response.json();
  } catch (err) {
    alert(err);
    return { data: [], pagy: {} as Pagy };
  }
};
export const ticketCreate = async (data: { [key: string]: any }) => {
  try {
    const csrfToken = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content;
    const response = await fetch('/tickets', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
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
    email_of_submitter: '',
    name_of_submitter: '',
    assigned_to_id: null,
    created_by_id: null,
    status: 'open',
    created_at: '',
    updated_at: '',
    url: '',
    assigned_to_name: '',
  };
};
export const fetchTicketData = async (ticketId: string): Promise<Ticket> => {
  try {
    const response = await fetch(`/tickets/${ticketId}.json`);
    return await response.json();
  } catch (err) {
    alert(err);
    return getInitialTicketState();
  }
};
export const ticketUpdate = async (ticketId, data: { [key: string]: any }) => {
  try {
    const csrfToken = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content;
    const response = await fetch(`/tickets/${ticketId}`, {
      method: 'PATCH',
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (err) {
    alert(err);
    return {};
  }
};
export const fetchAllTicketStatus = async (): Promise<TicketStatus[]> => {
  try {
    const response = await fetch(`/tickets/all_status.json`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return await response.json();
  } catch (err) {
    alert(err);
    return [];
  }
};
export const ticketDelete = async ticketId => {
  try {
    const csrfToken = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content;
    const response = await fetch(`/tickets/${ticketId}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const result = await response.json();
    if (result.error) {
      alert(result.error);
    }
    return result;
  } catch (err) {
    alert(err);
  }
};
