import { useQuery } from 'react-query';
import * as React from 'react';
import { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Spinner } from '../../../components/Spinner';

import { fetchDashBoardStaticData } from '../../../services/serviceDashBoard';

import { BiTrendingDown } from 'react-icons/bi';
import { GoAlert, GrAlert } from 'react-icons/all';
import { Card } from '../../../components/card/Card';
import styles from './FixedDashboard.module.scss';

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
    <div className={styles.cards}>
      <Card
          style={{marginRight: 10}}
        footer={
          <>
            <div>Overdue</div>
            <BiTrendingDown />
          </>
        }
      >
        {data.data.overdue_count}
        <GoAlert />
      </Card>
      <Card

        footer={
          <>
            <div>Due Today</div>
            <BiTrendingDown />
          </>
        }
      >
        {data.data.due_today}
        <GoAlert />
      </Card>
    </div>
  );
};
