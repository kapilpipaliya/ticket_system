import { useQuery } from 'react-query';
import * as React from 'react';
import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Spinner } from '../../../components/Spinner';

import { fetchDashBoardStaticData } from '../../../services/serviceDashBoard';

import { BiTrendingDown } from 'react-icons/bi';
import { GoAlert } from 'react-icons/all';
import { Card } from '../../../components/card/Card';
import styles from './DynamicDashboard.module.scss';

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
        footerClassName={styles.bgWarning}
        footer={
          <>
            <div>Overdue</div>
            <BiTrendingDown />
          </>
        }
      >
        <span className={styles.warning}>{data.data.overdue_count}</span>
        <GoAlert />
      </Card>
      <Card
        footerClassName={styles.bgWarning}
        footer={
          <>
            <div>Due Today</div>
            <BiTrendingDown />
          </>
        }
      >
        <span className={styles.warning}>{data.data.due_today}</span>
        <GoAlert />
      </Card>
    </div>
  );
};
