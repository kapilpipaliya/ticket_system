import * as React from 'react';
import { useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';

import { useQuery } from 'react-query';
import { fetchDashBoardData } from '../../../services/serviceDashBoard';
import { AlertTriangle, FilePlus } from 'react-feather';
import { Ticket } from '../../Types';
import { RangeDatePicker } from 'react-google-flight-datepicker';
import 'react-google-flight-datepicker/dist/main.css';

const LatestActivity = (props: { rows: Ticket[] }) => {
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
                    {row.subject} <span className="text-muted float-right f-13">{new Date(row.created_at).toUTCString()}</span>
                  </h6>
                </a>
              </Col>
            </Row>
          );
        })}
      </Card.Body>
      <Card.Footer className="text-center">
        <a href={'#'} className="b-b-primary text-primary">
          View all Feeds
        </a>
      </Card.Footer>
    </Card>
  );
};

function StatisticCard(props: { title: string; subtitle: number | string; icon: React.ReactNode }) {
  return (
    <Card className={'mb-2'}>
      <Card.Body>
        <Row className="align-items-center m-l-0">
          <Col>
            <h6 className="text-muted m-b-10" style={{ whiteSpace: 'nowrap' }}>
              {props.title}
            </h6>
            <h2 className="m-b-0">{props.subtitle}</h2>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

const DashBoard = () => {
  const [start, setStart] = useState(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  });
  const [end, setEnd] = useState(new Date());
  const { isLoading, error, data, refetch, isFetching } = useQuery([start, end], () => fetchDashBoardData(start.valueOf() / 1000, end.valueOf() / 1000));
  const handleOnDateChange = (startDate, endDate) => {
    if (startDate && endDate) {
      setStart(startDate);
      setEnd(endDate);
    }
  };
  if (isLoading || isFetching) return <Container>Loading...</Container>;
  return (
    <Container>
      <Row>
        <Col>
          <StatisticCard icon={<AlertTriangle />} title={'Overdue'} subtitle={data.data.overdue_count} />
        </Col>
        <Col>
          <StatisticCard icon={<AlertTriangle />} title={'Due Today'} subtitle={data.data.tickets_per_day} />
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={6}></Col>
        <Col xs={12} md={6}>
          <RangeDatePicker startDate={start} endDate={end} onChange={handleOnDateChange} />
        </Col>
      </Row>

      <Row>
        <Col>
          <StatisticCard icon={<AlertTriangle />} title={'Unresolved'} subtitle={data.data.unresolved_count} />
        </Col>
        <Col>
          <StatisticCard icon={<FilePlus />} title={'New Tickets'} subtitle={data.data.new_tickets} />
        </Col>
        <Col>
          <StatisticCard icon={<AlertTriangle />} title={'Open'} subtitle={data.data.open} />
        </Col>
        <Col>
          <StatisticCard icon={<AlertTriangle />} title={'On Hold'} subtitle={data.data.hold} />
        </Col>
        <Col>
          <StatisticCard icon={<AlertTriangle />} title={'Closed'} subtitle={data.data.close} />
        </Col>
        <Col>
          <StatisticCard icon={<AlertTriangle />} title={'Assigned'} subtitle={data.data.assigned} />
        </Col>
        <Col>
          <StatisticCard icon={<AlertTriangle />} title={'Replies'} subtitle={data.data.replies} />
        </Col>
        <Col>
          <StatisticCard icon={<AlertTriangle />} title={'Tickets Per Day'} subtitle={data.data.tickets_per_day} />
        </Col>
      </Row>
      <Row className={'mt-1'}>
        <Col xl={12} md={12}>
          <LatestActivity rows={data.data.latest_activity} />
        </Col>
      </Row>
    </Container>
  );
};
export default DashBoard;
