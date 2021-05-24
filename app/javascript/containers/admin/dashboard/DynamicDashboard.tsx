import * as React from 'react';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { fetchDashBoardData, fetchLastActivityData } from '../../../services/serviceDashBoard';
import { DateSelectDropdown } from './DateSelectDropdown';
import { Spinner } from '../../../components/Spinner';
import { LatestActivity } from './LatestActivity';
import styles from './DynamicDashboard.module.scss';
import clsx from 'clsx';

const dummyFn = async () => {
  return { data: false as any };
};

export function DynamicDashboard() {
  const [start, setStart] = useState<Date | false>(false);
  const [end, setEnd] = useState<Date | false>(false);
  const [lastActivityCount, setLastActivityCount] = useState(5);

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
      keepPreviousData: true,
    },
  );
  const {
    isLoading: lastActivityIsLoading,
    data: lastActivityData,
    refetch: lastActivityReFetch,
    isFetching: lastActivityIsFetching,
  } = useQuery(
    ['last_activity_data', start, end, lastActivityCount],
    () => {
      if (start && end) return fetchLastActivityData(start.valueOf() / 1000, end.valueOf() / 1000, lastActivityCount);
      else {
        return dummyFn();
      }
    },
    {
      enabled: false,
    },
  );

  useEffect(() => {
    if (start && end) {
      setLastActivityCount(5);
      refetch();
      lastActivityReFetch();
    }
  }, [start, end]);
  useEffect(() => {
    lastActivityReFetch();
  }, [lastActivityCount]);

  const handleOnDateChange = React.useCallback((startDate, endDate) => {
    if (startDate && endDate) {
      setStart(startDate);
      setEnd(endDate);
    }
  }, []);
  const handleGetAllActivity = () => {
    setLastActivityCount(0);
  };

  return (
    <>
      <DateSelectDropdown handleRangeSelect={handleOnDateChange} className={styles.filterButton} isDisabled={isLoading || isFetching || !data} />
      {isLoading || isFetching || !data ? (
        <Spinner />
      ) : (
        <>
          {data?.data && (
            <>
              <div className={styles.cards}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.warning}>{data.data.unresolved_count}</span>
                  </div>
                  <div className={clsx(styles.cardFooter, styles.bgWarning)}>
                    <div>Unresolved</div>
                  </div>
                </div>

                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.warning}>{data.data.new_tickets}</span>
                  </div>
                  <div className={clsx(styles.cardFooter, styles.bgWarning)}>
                    <div>New Tickets</div>
                  </div>
                </div>

                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.warning}>{data.data.open}</span>
                  </div>
                  <div className={clsx(styles.cardFooter, styles.bgWarning)}>
                    <div>Open</div>
                  </div>
                </div>

                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.warning}>{data.data.hold}</span>
                  </div>
                  <div className={clsx(styles.cardFooter, styles.bgWarning)}>
                    <div>On Hold</div>
                  </div>
                </div>

                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.success}>{data.data.close}</span>
                  </div>
                  <div className={clsx(styles.cardFooter, styles.bgSuccess)}>
                    <div>Closed</div>
                  </div>
                </div>

                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.success}>{data.data.assigned}</span>
                  </div>
                  <div className={clsx(styles.cardFooter, styles.bgSuccess)}>
                    <div>Assigned</div>
                  </div>
                </div>

                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.success}>{data.data.replies}</span>
                  </div>
                  <div className={clsx(styles.cardFooter, styles.bgSuccess)}>
                    <div>Replies</div>
                  </div>
                </div>

                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.success}>{data.data.tickets_per_day}</span>
                  </div>
                  <div className={clsx(styles.cardFooter, styles.bgSuccess)}>
                    <div>Tickets per day</div>
                  </div>
                </div>
              </div>

              <LatestActivity
                data={lastActivityData?.data}
                handleGetAllActivity={handleGetAllActivity}
                showFetchAllButton={lastActivityCount != 0}
                loading={lastActivityIsLoading || lastActivityIsFetching}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
