import * as React from 'react';
import * as ReactDOM from 'react-dom'

import {TicketCreate} from "../../containers/support/TicketCreate";
document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <TicketCreate/>,
        document.body.appendChild(document.createElement('div')),
    )
})
