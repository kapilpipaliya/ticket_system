import { useQuery } from 'react-query';
import * as React from 'react';
import { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Spinner } from '../../../components/Spinner';
import { AlertTriangle } from 'react-feather';
import { StatisticCard } from './StatisticCard';
import { fetchDashBoardData, fetchDashBoardStaticData } from '../../../services/serviceDashBoard';

export const FixedDashboard = () => {
  const { isLoading, error, data, refetch, isFetching } = useQuery(
    ['dashboard_data'],
    () => {
      return fetchDashBoardStaticData();
    },
    {
      enabled: false,
    },
  );

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading || isFetching)
    return (
      <Container className={'mt-2'}>
        <Spinner />
      </Container>
    );
  if (!data) return <Container className={'mt-2'}>No Data found</Container>;
  return (
    <Row>
      <Col>
        <StatisticCard icon={<AlertTriangle />} title={'Overdue'} subtitle={data.data.overdue_count} />
      </Col>
      <Col>
        <StatisticCard icon={<AlertTriangle />} title={'Due Today'} subtitle={data.data.due_today} />
      </Col>
    </Row>
  );
};
