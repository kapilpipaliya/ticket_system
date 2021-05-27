import * as React from 'react';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import clsx from 'clsx';
import { fetchDashBoardData, fetchLastActivityData } from '../../../services/serviceDashBoard';
import { DateSelectDropdown } from './DateSelectDropdown';
import { LatestActivity } from './LatestActivity';
import { SpinnerModal } from '../../../components/SpinnerModal';
import { Card, CardFooter, CardHeader } from '../../../components/card/Card';
import styles from './DynamicDashboard.module.scss';

export function DynamicDashboard() {
  const [startDate, setStartDate] = useState<Date | false>(false);
  const [endDate, setEndDate] = useState<Date | false>(false);
  const [lastActivityCount, setLastActivityCount] = useState(5);

  const { isLoading, error, data, refetch, isFetching } = useQuery(
    ['dashboard_data', startDate, endDate],
    () => {
      if (startDate && endDate) return fetchDashBoardData(startDate.valueOf() / 1000, endDate.valueOf() / 1000);
      else {
        return { data: false as any };
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
    ['last_activity_data', startDate, endDate, lastActivityCount],
    () => {
      if (startDate && endDate) return fetchLastActivityData(startDate.valueOf() / 1000, endDate.valueOf() / 1000, lastActivityCount);
      else {
        return { data: false as any };
      }
    },
    {
      enabled: false,
      keepPreviousData: true,
    },
  );

  useEffect(() => {
    if (startDate && endDate) {
      setLastActivityCount(5);
      refetch();
      lastActivityReFetch();
    }
  }, [startDate, endDate]);
  useEffect(() => {
    lastActivityReFetch();
  }, [lastActivityCount]);

  const handleOnDateChange = React.useCallback((startDate, endDate) => {
    if (startDate && endDate) {
      setStartDate(startDate);
      setEndDate(endDate);
    }
  }, []);
  const setActivityCountZero = () => setLastActivityCount(0);

  return (
    <>
      <DateSelectDropdown handleRangeSelect={handleOnDateChange} className={styles.filterButton} isDisabled={isLoading || isFetching || !data} />
      <SpinnerModal loading={isLoading || isFetching || !data} />
      <>
        {data?.data && (
          <>
            <div className={styles.cards}>
              <Card className={styles.card}>
                <CardHeader className={styles.cardHeader}>
                  <span className={styles.warning}>{data.data.unresolved_count}</span>
                </CardHeader>
                <CardFooter className={styles.bgWarning}>
                  <div>Unresolved</div>
                </CardFooter>
              </Card>

              <Card className={styles.card}>
                <CardHeader className={styles.cardHeader}>
                  <span className={styles.warning}>{data.data.new_tickets}</span>
                </CardHeader>
                <CardFooter className={styles.bgWarning}>
                  <div>New Tickets</div>
                </CardFooter>
              </Card>

              <Card className={styles.card}>
                <CardHeader className={styles.cardHeader}>
                  <span className={styles.warning}>{data.data.open}</span>
                </CardHeader>
                <CardFooter className={styles.bgWarning}>
                  <div>Open</div>
                </CardFooter>
              </Card>

              <Card className={styles.card}>
                <CardHeader className={styles.cardHeader}>
                  <span className={styles.warning}>{data.data.hold}</span>
                </CardHeader>
                <CardFooter className={styles.bgWarning}>
                  <div>On Hold</div>
                </CardFooter>
              </Card>

              <Card className={styles.card}>
                <CardHeader className={styles.cardHeader}>
                  <span className={styles.success}>{data.data.close}</span>
                </CardHeader>
                <CardFooter className={styles.bgSuccess}>
                  <div>Closed</div>
                </CardFooter>
              </Card>

              <Card className={styles.card}>
                <CardHeader className={styles.cardHeader}>
                  <span className={styles.success}>{data.data.assigned}</span>
                </CardHeader>
                <CardFooter className={styles.bgSuccess}>
                  <div>Assigned</div>
                </CardFooter>
              </Card>

              <Card className={styles.card}>
                <CardHeader className={styles.cardHeader}>
                  <span className={styles.success}>{data.data.replies}</span>
                </CardHeader>
                <CardFooter className={styles.bgSuccess}>
                  <div>Replies</div>
                </CardFooter>
              </Card>

              <Card className={styles.card}>
                <CardHeader className={styles.cardHeader}>
                  <span className={styles.success}>{data.data.tickets_per_day}</span>
                </CardHeader>
                <CardFooter className={styles.bgSuccess}>
                  <div>Tickets per day</div>
                </CardFooter>
              </Card>
            </div>

            <LatestActivity
              data={lastActivityData?.data}
              handleGetAllActivity={setActivityCountZero}
              showFetchAllButton={lastActivityCount != 0}
              loading={lastActivityIsLoading || lastActivityIsFetching}
            />
          </>
        )}
      </>
    </>
  );
}
