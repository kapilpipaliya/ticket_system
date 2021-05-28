import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export function mount(Component, mountNodeId) {
  document.addEventListener('DOMContentLoaded', () => {
    const mountNode = document.getElementById(mountNodeId);
    const propsJSON = mountNode.getAttribute('data-react-props');
    const props = JSON.parse(propsJSON);

    ReactDOM.render(
      <QueryClientProvider client={queryClient}>
        <Component {...props} />
      </QueryClientProvider>,
      mountNode,
    );
  });
}
