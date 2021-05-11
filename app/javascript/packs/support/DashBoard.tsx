import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import DashBoard from '../../containers/admin/dashboard/DashBoard';

const queryClient = new QueryClient();
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <QueryClientProvider client={queryClient}>
      <DashBoard />
    </QueryClientProvider>,
    document.body.appendChild(document.createElement('div')),
  );
});
