import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { TicketEdit } from '../../containers/support/admin/TicketEdit';
const queryClient = new QueryClient();
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <QueryClientProvider client={queryClient}>
      <TicketEdit />
    </QueryClientProvider>,
    document.body.appendChild(document.createElement('div')),
  );
});
