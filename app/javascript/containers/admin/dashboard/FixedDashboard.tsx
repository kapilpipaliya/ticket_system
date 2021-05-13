import { useQuery } from 'react-query';
import * as React from 'react';
import { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Spinner } from '../../../components/Spinner';

import { fetchDashBoardStaticData } from '../../../services/serviceDashBoard';
import PageStatisticCard from '../../../components/statistic/PageStatisticCard';
import { BiTrendingDown } from 'react-icons/bi';
import { GoAlert, GrAlert } from 'react-icons/all';

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
      <Col xs={6} md={2}>
        <PageStatisticCard
          params={{
            iconName: <GoAlert />,
            footerIcon: <BiTrendingDown />,
            variant: 'warning',
            title: '',
            primaryText: data.data.overdue_count,
            secondaryText: 'Overdue',
          }}
        />
      </Col>
      <Col xs={6} md={2}>
        <PageStatisticCard
          params={{
            iconName: <GrAlert />,
            footerIcon: <BiTrendingDown />,
            variant: 'warning',
            title: '',
            primaryText: data.data.due_today,
            secondaryText: 'Due Today',
          }}
        />
      </Col>
    </Row>
  );
};
