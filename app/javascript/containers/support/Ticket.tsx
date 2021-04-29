import * as React from 'react';

import {useEffect, useState} from "react";
const Ticket = (props) => {
    const [ticket, setTicket] = useState({});
    const [comments, setComments] = useState({});
    useEffect(()=>{
    const fetchTicketData = async () => {
        try {
            const response = await fetch('/tickets/4.json')
            const ticket = await response.json();
            setTicket(ticket);
            const responseComments = await fetch('/tickets/4.json')
            const comments = await responseComments.json();
            setComments(comments);

        } catch (err) {
            alert(err);
        }
    }
    })
    return <div>This is ticket show page</div>
}
