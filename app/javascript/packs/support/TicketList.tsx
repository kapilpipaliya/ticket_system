import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { TicketList } from '../../containers/support/TicketList';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<TicketList />, document.body.appendChild(document.createElement('div')));
});
