import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { TicketEdit } from '../../containers/support/TicketEdit';
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<TicketEdit />, document.body.appendChild(document.createElement('div')));
});
