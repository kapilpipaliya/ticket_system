import * as React from 'react';
import * as ReactDOM from 'react-dom'

import {CreateTicket} from "../../containers/support/CreateTicket";
document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <CreateTicket/>,
        document.body.appendChild(document.createElement('div')),
    )
})
