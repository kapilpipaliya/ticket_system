import { SearchState } from './TicketTypes';
import * as React from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';

export const TicketSearch = (props: {
  searchState: SearchState;
  setSearchState: React.Dispatch<React.SetStateAction<SearchState>>;
  status: string | number;
  setStatus: React.Dispatch<React.SetStateAction<string | number>>;
  statusOptions: any[];
  onSubmit: () => void;
  loading: boolean;
  onReset: () => void;
}) => {
  const { searchState, setSearchState, status, setStatus } = props;
  return (
    <Row>
      <Col sm={6}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={props.searchState.name} onChange={e => setSearchState({ ...searchState, name: e.target.value })} />
        </Form.Group>
      </Col>
      <Col sm={6}>
        <Form.Group controlId="formName">
          <Form.Label>Email</Form.Label>
          <Form.Control type="text" value={props.searchState.email} onChange={e => setSearchState({ ...searchState, email: e.target.value })} />
        </Form.Group>
      </Col>
      <Col sm={6}>
        <Form.Group controlId="formName">
          <Form.Label>Subject</Form.Label>
          <Form.Control type="text" value={props.searchState.subject} onChange={e => setSearchState({ ...searchState, subject: e.target.value })} />
        </Form.Group>
      </Col>
      <Col sm={6}>
        <Form.Group controlId="formName">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" value={props.searchState.description} onChange={e => setSearchState({ ...searchState, description: e.target.value })} />
        </Form.Group>
      </Col>
      <Col sm={6}>
        <Form.Group controlId="formName">
          <Form.Label>Status</Form.Label>
          <Form.Control as="select" value={status} onChange={e => setStatus(e.target.value)}>
            {props.statusOptions.map(s => {
              return (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              );
            })}
          </Form.Control>
        </Form.Group>
      </Col>
      <Col sm={6} className="align-self-center ">
        <Button variant="secondary" className={'mr-2'} onClick={props.onReset} {...(props.loading ? { disabled: true } : {})}>
          Reset
        </Button>
        <Button variant="primary" onClick={props.onSubmit} {...(props.loading ? { disabled: true } : {})}>
          {props.loading && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />}
          {props.loading ? 'Searching...' : 'Search'}
        </Button>
      </Col>
    </Row>
  );
};
