import { Ticket } from '../../Types';
import { Button, Card, Col, Row } from 'react-bootstrap';
import * as React from 'react';

interface LatestActivityParams {
  rows: Ticket[];
  handleGetAllActivity: () => void;
  showFetchAllButton: boolean;
}

export const LatestActivity = (props: LatestActivityParams) => {
  return (
    <Card className="feed-card">
      <Card.Header>
        <h5>Latest Activity</h5>
      </Card.Header>
      <Card.Body>
        {props.rows.map(row => {
          return (
            <Row key={row.id} className="m-b-30">
              <Col sm="auto" className="p-r-0">
                <i className="feather icon-bell bg-c-blue feed-icon" />
              </Col>
              <Col>
                <a href={'#'}>
                  <h6 className="m-b-5">
                    {row.subject} <span className="text-muted float-end f-13">{new Date(row.created_at).toLocaleString()}</span>
                  </h6>
                </a>
              </Col>
            </Row>
          );
        })}
      </Card.Body>
      <Card.Footer className="text-center">{props.showFetchAllButton && <Button onClick={props.handleGetAllActivity}>View all Feeds</Button>}</Card.Footer>
    </Card>
  );
};
