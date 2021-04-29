import * as React from "react";
import {useEffect, useState} from "react";
import {Button, Card, Col, Container, Modal, Row, Table} from 'react-bootstrap';
import {Edit, Plus, Trash2, Trello} from 'react-feather';
import {Ticket} from "./TicketTypes";

interface TicketProps {
    ticket: Ticket
}

export const TicketItem = (props: TicketProps) => {
    return (
        <>
            <td>{props.ticket.name_of_submitter}</td>
            <td>{props.ticket.email_of_submitter}</td>
            <td>{props.ticket.subject}</td>
            <td>{props.ticket.description}</td>
            <td>{props.ticket.assigned_to}</td>
            <td>{props.ticket.created_at}</td>
            <td>{props.ticket.updated_at}</td>
            {/*<td>Url: {props.ticket.url}</td>*/}
            <td><a href={`tickets/${props.ticket.id}/edit?id=${props.ticket.id}`} className="text-muted">
                <Edit className={'mr-1'}/>
            </a>
                <a href={"#"} className="text-muted">
                    <Trash2/>
                </a></td>
        </>
    )
}

const AddNewTicketModal = (props: { show: boolean, onHide: () => void }) => {
    return <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
            <Modal.Title as="h5">
                <Trello/>
                 Add Ticket
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row>
                <Col sm={6}>
                    <div className="form-group fill">
                        <label className="floating-label" htmlFor="Name">
                            Name
                        </label>
                        <input type="text" className="form-control" id="Name" placeholder="Name"/>
                    </div>
                </Col>
                <Col sm={6}>
                    <div className="form-group fill">
                        <label className="floating-label" htmlFor="Email">
                            Email
                        </label>
                        <input type="email" className="form-control" id="Email" placeholder="Email"/>
                    </div>
                </Col>
                <Col sm={12}>
                    <div className="form-group fill">
                        <label className="floating-label" htmlFor="Subject">
                            Subject
                        </label>
                        <input type="text" className="form-control" id="Subject" placeholder="Subject"/>
                    </div>
                </Col>
                <Col sm={12}>
                    <div className="form-group fill">
                        <label className="floating-label" htmlFor="Description">
                            Description
                        </label>
                        <textarea className="form-control" id="Description" rows={3} placeholder="Description"/>
                    </div>
                </Col>
                <Col sm={12}>
                    <div className="form-group fill">
                        <label className="floating-label" htmlFor="Icon">
                            Image
                        </label>
                        <input type="file" className="form-control" id="Icon"
                               placeholder="Image"/>
                    </div>
                </Col>
            </Row>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="danger" onClick={props.onHide}>
                Clear
            </Button>
            <Button variant="primary">Submit</Button>
        </Modal.Footer>
    </Modal>;
}

export const TicketList = () => {
    const [isOpen, setIsOpen] = useState(false);
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
    return (
        <Container>
            <Row>
                <Col sm={12}>
                    <Card className="shadow-none">
                        <Card.Header>
                            <h5>All Tickets</h5>
                            <div className="card-header-right">
                                <Button variant="success" className="btn-sm btn-round has-ripple"
                                        onClick={() => setIsOpen(true)}>
                                    <Plus/> Add Ticket
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body className="shadow border-0">
                            <Table responsive hover>
                                <thead>
                                <tr>
                                    <th className="border-top-0">Name</th>
                                    <th className="border-top-0">Email</th>
                                    <th className="border-top-0">Subject</th>
                                    <th className="border-top-0">Description</th>
                                    <th className="border-top-0">Assigned to</th>
                                    <th className="border-top-0">Created</th>
                                    <th className="border-top-0">Updated</th>
                                    <th className="border-top-0"/>
                                </tr>
                                </thead>
                                <tbody>
                                {ticketData.map(item => {
                                    return (<tr key={item.id}><TicketItem ticket={item}/></tr>)
                                })}
                                </tbody>
                            </Table>
                            <div className="pagination-block text-center">
                                <nav aria-label="Page navigation example" className="d-inline-block">
                                    <ul className="pagination">
                                        <li className="page-item">
                                            <a className="page-link" href={"#"}>
                                                Previous
                                            </a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href={"#"}>
                                                1
                                            </a>
                                        </li>
                                        <li className="page-item active">
                                            <a className="page-link" href={"#"}>
                                                2
                                            </a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href={"#"}>
                                                3
                                            </a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href={"#"}>
                                                Next
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </Card.Body>
                    </Card>
                    <AddNewTicketModal show={isOpen} onHide={() => setIsOpen(false)}/>
                </Col>
            </Row>
        </Container>
    );
};
export default TicketList;
