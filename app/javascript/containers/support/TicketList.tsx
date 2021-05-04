import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Button, Card, Col, Container, Form, Modal, Pagination, Row, Table} from 'react-bootstrap';
import {Edit, Plus, Trash2, Trello} from 'react-feather';
import {CurrentUser, Pagy, SortDirection, SortState, Ticket} from './TicketTypes';
import {DisplayFormError} from './DisplayFormError';
import 'jodit';
import 'jodit/build/jodit.min.css';
import {IJodit} from 'jodit';
import JoditEditor from 'jodit-react';
import {fetchAllTicketData, getInitialErrorState, ticketCreate, ticketDelete} from './serviceTicket';
import {fetchCurrentUser} from './serviceUser';
import {ToastNotification} from './ToastNotification';
import {ConfirmationDialog} from './ConfirmationDialog';
import styles from './TicketList.module.scss';
import clsx from 'clsx';

interface TicketProps {
  ticket: Ticket;
  onDelete: () => Promise<void>;
}

export const TicketItem = (props: TicketProps) => {
  return (
    <>
      <td>{props.ticket.name}</td>
      <td>{props.ticket.email}</td>
      <td className={'text-truncate'} style={{ maxWidth: 300 }}>
        {props.ticket.subject}
      </td>
      <td className={'text-truncate'} style={{ maxWidth: 300 }}>
        {props.ticket.description}
      </td>
      <td>{props.ticket.assignee_name}</td>
      <td>{new Date(props.ticket.created_at).toUTCString()}</td>
      <td>{new Date(props.ticket.updated_at).toUTCString()}</td>
      {/*<td>Url: {props.ticket.url}</td>*/}
      <td style={{ display: 'flex', flexWrap: 'nowrap' }}>
        <a href={`tickets/${props.ticket.id}/edit`} className="text-muted">
          <Edit className={'mr-1'} />
        </a>

        <Trash2 style={{ cursor: 'pointer' }} onClick={props.onDelete} />
      </td>
    </>
  );
};

interface NewTicketModal {
  show: boolean;
  onHide: () => void;
  onNewTicket: (ticket: Ticket) => void;
  currentUser: CurrentUser;
}

const AddNewTicketModal = (props: NewTicketModal) => {
  const [isSuccess, setIsSuccess] = useState(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const nameOfSubmitterRef = useRef<HTMLInputElement>(null);
  const emailOfSubmitterRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');
  const config: Partial<IJodit['options']> = {
    readonly: false,
  };
  const [errors, setErrors] = useState(getInitialErrorState());
  const handleSubmitForm = e => {
    e.preventDefault();
    const submitForm = async () => {
      const result = await ticketCreate({
        subject: subjectRef.current.value,
        name: nameOfSubmitterRef.current.value,
        email: emailOfSubmitterRef.current.value,
        description,
        creator_id: props.currentUser ? props.currentUser.id : props.currentUser,
      });
      if (result.id) {
        subjectRef.current.value = '';
        nameOfSubmitterRef.current.value = '';
        emailOfSubmitterRef.current.value = '';
        setDescription('');
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 5000);
        setErrors({ ...getInitialErrorState() });
        props.onHide();
        props.onNewTicket(result);
      } else {
        setErrors({ ...getInitialErrorState(), ...result });
      }
    };
    submitForm().then(() => {});
  };
  const onClear = () => {
    subjectRef.current.value = '';
    nameOfSubmitterRef.current.value = '';
    emailOfSubmitterRef.current.value = '';
    setDescription('');
    props.onHide();
  };
  return (
    <Modal show={props.show} onHide={props.onHide} size={'lg'}>
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Trello />
          Add Ticket
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col sm={6}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Name" value={props.currentUser.first_name} ref={nameOfSubmitterRef} disabled isInvalid={errors.name.length} />
              <DisplayFormError errors={errors.name} />
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" value={props.currentUser.email} ref={emailOfSubmitterRef} disabled isInvalid={errors.email.length} />
              <DisplayFormError errors={errors.email} />
            </Form.Group>
          </Col>
          <Col sm={12}>
            <Form.Group controlId="formSubject">
              <Form.Label>Subject</Form.Label>
              <Form.Control type="text" placeholder="Subject" ref={subjectRef} isInvalid={errors.subject.length} />
              <DisplayFormError errors={errors.subject} />
            </Form.Group>
          </Col>
          <Col sm={12}>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <JoditEditor key={2} value={description} config={config as any} onBlur={setDescription} />
              <div className={`${errors.description.length ? 'is-invalid' : ''}`} />
              <DisplayFormError errors={errors.description} />
            </Form.Group>
          </Col>
          <Col sm={12}>
            <div className="form-group fill">
              <label className="floating-label" htmlFor="Icon">
                Image
              </label>
              <input type="file" className="form-control" id="Icon" placeholder="Image" />
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClear}>
          Clear
        </Button>
        <Button onClick={handleSubmitForm}>Submit</Button>
      </Modal.Footer>
    </Modal>
  );
};

export const TicketList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [ticketData, setTicketData] = useState([]);
  const [deleteConfirmationData, setDeleteConfirmationData] = useState({ show: false, ticketId: 0 });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [pagy, setPagy] = useState<Pagy>({} as Pagy);
  const [pageNo, setPageNo] = useState<number | string>(1);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [sortState, setSortState] = useState<SortState>({});

  const getTicketData = page_number => {
    fetchAllTicketData(page_number, sortState).then(resp => {
      setTicketData(resp.data);
      setPagy(resp.pagy);
      fetchCurrentUser().then(resp => setCurrentUser(resp));
    });
  };
  useEffect(() => getTicketData(pageNo), [pageNo, sortState]);
  const onTicketDeleteConfirm = ticketId => async () => {
    setDeleteConfirmationData(prevState => {
      return { ...prevState, show: true, ticketId };
    });
  };
  const setShowTicketDeleteConfirm = (show: boolean) => {
    setDeleteConfirmationData(prevState => {
      return { ...prevState, show };
    });
  };
  const onTicketConfirmCancel = () => {
    setShowTicketDeleteConfirm(false);
  };
  const onTicketDelete = async () => {
    setShowTicketDeleteConfirm(false);
    await ticketDelete(deleteConfirmationData.ticketId).then(resp => {
      if (!resp.error) {
        getTicketData(pageNo);
        setToastMessage('Ticket deleted successfully');
        setShowToast(true);
      }
    });
  };
  const onNewTicket = (ticket: Ticket) => {
    getTicketData(pageNo);
    setToastMessage('Ticket created successfully');
    setShowToast(true);
  };
  const handlePageChange = (page_number: number | string) => () => {
    setPageNo(page_number);
  };
  const handleOnSortClick = (column_id: string, order?: SortDirection) => (e?: React.MouseEvent) => {
    setSortState(prevState => {
          const sortOrder = sortState[column_id];
          const newSortState = (!e || !e.ctrlKey) ? {} : {...prevState}
          if (order !== undefined) {
            // when clicked from context menu
            return ({...newSortState, [column_id]: order})
          } else {
            if (sortOrder === null || sortOrder === undefined || sortOrder === SortDirection.None) {
              return ({...newSortState, [column_id]: SortDirection.Ascending})
            } else if (sortOrder === SortDirection.Ascending) {
              return ({...newSortState, [column_id]: SortDirection.Descending})
            } else {
              delete newSortState[column_id]
              return newSortState
            }
          }
    })
  }
  const SortIcon = (p: {id: string}) => {
    if(sortState[p.id] ===SortDirection.Ascending) return <>▲</>;
    if(sortState[p.id] ===SortDirection.Descending) return <>▼</>;
    return <></>
  }
  return (
    <Container>
      <ToastNotification show={showToast} setShow={setShowToast} message={toastMessage} />
      <ConfirmationDialog
        show={deleteConfirmationData.show}
        setShow={setShowTicketDeleteConfirm}
        onCancel={onTicketConfirmCancel}
        onSubmit={onTicketDelete}
        title={'Are you sure?'}
        body={'Ticket and its comments will be deleted permanently.'}
        okButtonLabel={'Confirm'}
      />
      {currentUser && <AddNewTicketModal show={isOpen} onHide={() => setIsOpen(false)} onNewTicket={onNewTicket} currentUser={currentUser} />}
      <Row>
        <Col sm={12}>
          <Card className="shadow-none">
            <Card.Header>
              <h5>All Tickets</h5>
              <div className="card-header-right">
                <Button variant="success" className="btn-sm btn-round has-ripple" onClick={() => setIsOpen(true)}>
                  <Plus /> Add Ticket
                </Button>
              </div>
            </Card.Header>
            <Card.Body className={clsx(['shadow border-0', styles['support-table']])}>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th className="border-top-0" onClick={handleOnSortClick('name')}>Name <SortIcon id={'name'}/></th>
                    <th className="border-top-0" onClick={handleOnSortClick('email')}>Email <SortIcon id={'email'}/></th>
                    <th className="border-top-0" onClick={handleOnSortClick('subject')}>Subject <SortIcon id={'subject'}/></th>
                    <th className="border-top-0" onClick={handleOnSortClick('description')}>Description <SortIcon id={'description'}/></th>
                    <th className="border-top-0" style={{ whiteSpace: 'nowrap' }} onClick={handleOnSortClick('assignee_id')}>
                      Assigned to <SortIcon id={'assignee_id'}/>
                    </th>
                    <th className="border-top-0" onClick={handleOnSortClick('created_at')}>Created <SortIcon id={'created_at'}/></th>
                    <th className="border-top-0" style={{ whiteSpace: 'nowrap' }} onClick={handleOnSortClick('updated_at')}>
                      Last Activity <SortIcon id={'updated_at'}/>
                    </th>
                    <th className="border-top-0">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketData.map(item => {
                    return (
                      <tr key={item.id}>
                        <TicketItem ticket={item} onDelete={onTicketDeleteConfirm(item.id)} />
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <div className="pagination-block text-center">
                <nav aria-label="Page navigation example" className="d-inline-block">
                  <Pagination>
                    {/*@ts-ignore*/}
                    <Pagination.First onClick={handlePageChange(1)} disabled={!pagy.prev} />
                    {/*@ts-ignore*/}
                    <Pagination.Prev onClick={handlePageChange(pagy.prev)} disabled={!pagy.prev} />
                    {(pagy.series || []).map(x => {
                      if (typeof x == 'string' && x != 'gap')
                        return (
                          <Pagination.Item key={x} active onClick={handlePageChange(x)}>
                            {x}
                          </Pagination.Item>
                        );
                      if (typeof x == 'number')
                        return (
                          <Pagination.Item key={x} onClick={handlePageChange(x)}>
                            {x}
                          </Pagination.Item>
                        );
                      if (x == 'gap') return <Pagination.Ellipsis key={x} disabled />;
                      return <div key={x}>Error</div>;
                    })}
                    {/*@ts-ignore*/}
                    <Pagination.Next onClick={handlePageChange(pagy.next)} disabled={!pagy.next} />
                    {/*@ts-ignore*/}
                    <Pagination.Last onClick={handlePageChange(pagy.last)} disabled={!pagy.last || !pagy.next} />
                  </Pagination>
                </nav>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default TicketList;
