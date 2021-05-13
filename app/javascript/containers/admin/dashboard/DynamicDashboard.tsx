import { Ticket } from '../../Types';
import { ButtonGroup, Card, Col, Container, Row } from 'react-bootstrap';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { fetchDashBoardData } from '../../../services/serviceDashBoard';
import { DateSelectDropdown } from './DateSelectDropdown';
import { Spinner } from '../../../components/Spinner';
import { AlertTriangle, FilePlus } from 'react-feather';
import { StatisticCard } from './StatisticCard';

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
                    {row.subject} <span className="text-muted float-end f-13">{new Date(row.created_at).toLocaleString()}</span>
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

const dummyFn = async () => {
  return { data: false as any };
};

export function DynamicDashboard() {
  const [start, setStart] = useState<Date | false>(false);
  const [end, setEnd] = useState<Date | false>(false);
  const { isLoading, error, data, refetch, isFetching } = useQuery(
    ['dashboard_data', start, end],
    () => {
      if (start && end) return fetchDashBoardData(start.valueOf() / 1000, end.valueOf() / 1000);
      else {
        return dummyFn();
      }
    },
    {
      enabled: false,
    },
  );

  useEffect(() => {
    if (start && end) refetch();
  }, [start, end]);

  const handleOnDateChange = React.useCallback((startDate, endDate) => {
    if (startDate && endDate) {
      setStart(startDate);
      setEnd(endDate);
    }
  }, []);

  return (
    <>
      <Row>
        <Col xs={12} md={6}></Col>
        <Col xs={12} md={6} className="text-end mb-2">
          <ButtonGroup>
            <DateSelectDropdown handleRangeSelect={handleOnDateChange} />
          </ButtonGroup>
          {/*<RangeDatePicker startDate={start} endDate={end} onChange={handleOnDateChange} />*/}
        </Col>
      </Row>
      {isLoading || isFetching ? (
        <Container className={'mt-2'}>
          <Spinner />
        </Container>
      ) : (
        <>
          {data && data.data ? (
            <>
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
            </>
          ) : (
            <Container className={'mt-2'}>
              <Spinner />
            </Container>
          )}
        </>
      )}
    </>
  );
}
