import { useQuery } from 'react-query';
import * as React from 'react';
import { useEffect } from 'react';
import { Spinner } from '../../../components/Spinner';

import { fetchDashBoardStaticData } from '../../../services/serviceDashBoard';

import { BiTrendingDown } from 'react-icons/bi';
import { GoAlert } from 'react-icons/all';
import { Card } from '../../../components/card/Card';
import styles from './DynamicDashboard.module.scss';
import clsx from 'clsx';

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
      <div>
        <Spinner />
      </div>
    );
  if (!data) return <div>No Data found</div>;
  return (
    <div className={styles.cards}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.warning}>{data.data.overdue_count}</span>
        </div>

        <div className={clsx(styles.cardFooter, styles.bgWarning)}>
          <div>Overdue</div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.warning}>{data.data.due_today}</span>
        </div>
        <div className={clsx(styles.cardFooter, styles.bgWarning)}>
          <div>Due Today</div>
        </div>
      </div>
    </div>
  );
};
