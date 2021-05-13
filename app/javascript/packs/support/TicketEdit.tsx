import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { TicketEdit } from '../../containers/admin/ticket_edit/TicketEdit';

const queryClient = new QueryClient();
const mountNode = document.getElementById('ticket_edit');
const ticketId = mountNode.getAttribute('data-id');
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <QueryClientProvider client={queryClient}>
      <TicketEdit ticketId={ticketId} />
    </QueryClientProvider>,
    document.body.appendChild(document.createElement('div')),
  );
});
