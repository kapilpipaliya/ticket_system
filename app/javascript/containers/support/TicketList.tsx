import * as React from "react";
import {useEffect, useState} from "react";

interface Ticket {
    id: number;
    title: string;
    body: string;
    email_of_submitter: string;
    name_of_submitter: string;
    created_at: string;
    updated_at: string;
    url: string;
}

interface TicketProps {
    ticket: Ticket
}

export const TicketItem = (props: TicketProps) => {
    return (
        <div>
            <div>Title: {props.ticket.title}</div>
            <div>Body: {props.ticket.body}</div>
            <div>Email of submitter: {props.ticket.email_of_submitter}</div>
            <div>Name of submitter: {props.ticket.name_of_submitter}</div>
            <div>Created at: {props.ticket.created_at}</div>
            <div>Updated at: {props.ticket.updated_at}</div>
            <div>Url: {props.ticket.url}</div>
        </div>
    )
}
export const TicketList = () => {
    const [ticketData, setTicketData] = useState([]);
    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const response = await fetch('/tickets.json')
                const tickets = await response.json();
                setTicketData(tickets);
            } catch (err) {
                alert(err);
            }
        }
        fetchTicketData().then(() => {
        });
    }, []);
    const list = ticketData.map(item => {
        return (<li key={item.id}><TicketItem ticket={item}/></li>)
    })
    return <>
        <div>List of Tickets</div>
        <ul>{list}</ul>
    </>
}