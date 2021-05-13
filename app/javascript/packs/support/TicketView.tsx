import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import TicketView from '../../containers/admin/ticket_view/TicketView';

const queryClient = new QueryClient();
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <QueryClientProvider client={queryClient}>
      <TicketView />
    </QueryClientProvider>,
    document.body.appendChild(document.createElement('div')),
  );
});
