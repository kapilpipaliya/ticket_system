import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { TicketCreate } from '../../containers/support/TicketCreate';
const queryClient = new QueryClient();
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <QueryClientProvider client={queryClient}>
      <TicketCreate />
    </QueryClientProvider>,
    document.body.appendChild(document.createElement('div')),
  );
});
