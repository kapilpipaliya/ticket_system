import { useQuery } from 'react-query';
import * as React from 'react';
import { useEffect } from 'react';

import { fetchDashBoardStaticData } from '../../../services/serviceDashBoard';
import { SpinnerModal } from '../../../components/spinner/SpinnerModal';
import { Card, CardFooter, CardHeader } from '../../../components/card/Card';
import styles from './DynamicDashboard.module.scss';

export const FixedDashboard = () => {
  const { isLoading, error, data, refetch, isFetching } = useQuery(['dashboard_data'], fetchDashBoardStaticData, {
    enabled: false,
    keepPreviousData: true,
  });

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className={styles.cards}>
      <SpinnerModal loading={isLoading || isFetching || !data} />
      {data?.data && (
        <>
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <span className={styles.warning}>{data.data.overdue_count}</span>
            </CardHeader>

            <CardFooter className={styles.bgWarning}>
              <div>Overdue</div>
            </CardFooter>
          </Card>

          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <span className={styles.warning}>{data.data.due_today}</span>
            </CardHeader>
            <CardFooter className={styles.bgWarning}>
              <div>Due Today</div>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
};
