import * as React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

const PageStatisticCard = ({ params }: any) => {
  return (
    <Card className={'whitespace-nowrap mb-2'}>
      <Card.Body>
        <Row className="align-items-center">
          <Col className="col-8">
            <h4 className={`text-${params.variant}`}>{params.primaryText}</h4>
            <h6 className="text-muted mb-0">{params.title}</h6>
          </Col>
          <Col className="col-4 text-end">
            <i className="" style={{ fontSize: 24 }}>
              {params.iconName}
            </i>
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer className={`py-3 bg-${params.variant}`}>
        <Row className="align-items-center">
          <Col className="col-9">
            <p className="text-white mb-0">{params.secondaryText}</p>
          </Col>
          <Col className="col-3 text-end">{params.footerIcon}</Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default PageStatisticCard;
