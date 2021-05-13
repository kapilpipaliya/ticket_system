import * as React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

export const StatisticCard = (props: { title: string; subtitle: number | string; icon: React.ReactNode }) => {
  return (
    <Card className={'mb-2'}>
      <Card.Body>
        <Row className="align-items-center text-center">
          <Col>
            <h6 className="text-muted mb-10" style={{ whiteSpace: 'nowrap' }}>
              {props.title}
            </h6>
            <h4 className="mb-1">{props.subtitle}</h4>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
