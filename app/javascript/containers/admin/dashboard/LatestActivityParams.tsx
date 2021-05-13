import { Ticket } from '../../Types';
import { Button, Card, Col, Row } from 'react-bootstrap';
import * as React from 'react';
import { Spinner } from '../../../components/Spinner';
import { MdRssFeed } from 'react-icons/all';

interface LatestActivityParams {
  data: { latest_activity: Ticket[] };
  handleGetAllActivity: () => void;
  showFetchAllButton: boolean;
  loading: boolean;
}

export const LatestActivity = (props: LatestActivityParams) => {
  return (
    <Card className="feed-card">
      <Card.Header>
        <h5>Latest Activity</h5>
      </Card.Header>
      <Card.Body>
        {props?.data?.latest_activity.map(row => {
          return (
            <Row key={row.id}>
              <Col sm="auto" className="pe-0">
                <MdRssFeed />
              </Col>
              <Col>
                <a href={`/tickets/${row.id}`} className={'text-decoration-none'}>
                  <h6>
                    {row.subject} <span className="text-muted float-end f-13">{new Date(row.created_at).toLocaleString()}</span>
                  </h6>
                </a>
              </Col>
            </Row>
          );
        })}
      </Card.Body>
      <Card.Footer className="text-center">
        {props.loading && <Spinner />}
        {!props.loading && props.showFetchAllButton && <Button onClick={props.handleGetAllActivity}>View all activities</Button>}
      </Card.Footer>
    </Card>
  );
};
