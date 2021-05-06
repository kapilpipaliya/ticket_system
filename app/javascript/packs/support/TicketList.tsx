import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { TicketList } from '../../containers/support/admin/TicketList';
const queryClient = new QueryClient();
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <QueryClientProvider client={queryClient}>
      <TicketList />{' '}
    </QueryClientProvider>,
    document.body.appendChild(document.createElement('div')),
  );
});
