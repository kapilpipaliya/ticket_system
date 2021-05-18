import * as React from 'react';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { fetchDashBoardData, fetchLastActivityData } from '../../../services/serviceDashBoard';
import { DateSelectDropdown } from './DateSelectDropdown';
import { Spinner } from '../../../components/Spinner';
import { LatestActivity } from './LatestActivity';
import { BiTrendingDown, BiTrendingUp } from 'react-icons/bi';
import { AiOutlineFolderOpen, FaComment, FaResolving, FaUserMd, GoStop, GoThumbsup, MdToday, VscAdd } from 'react-icons/all';
import styles from './DynamicDashboard.module.scss';
import { Card } from '../../../components/card/Card';

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
      <DateSelectDropdown handleRangeSelect={handleOnDateChange} className={styles.filterButton} />
      {isLoading || isFetching || !data ? (
        <Spinner />
      ) : (
        <>
          {data?.data && (
            <>
              <div className={styles.cards}>
                <Card
                  footerClassName={styles.bgWarning}
                  footer={
                    <>
                      <div>Unresolved</div>
                      <BiTrendingDown />
                    </>
                  }
                >
                  <span className={styles.warning}>{data.data.unresolved_count}</span>
                  <FaResolving />
                </Card>

                <Card
                  footerClassName={styles.bgWarning}
                  footer={
                    <>
                      <div>New Tickets</div>
                      <BiTrendingDown />
                    </>
                  }
                >
                  <span className={styles.warning}>{data.data.new_tickets}</span>
                  <VscAdd />
                </Card>

                <Card
                  footerClassName={styles.bgWarning}
                  footer={
                    <>
                      <div>Open</div>
                      <BiTrendingDown />
                    </>
                  }
                >
                  <span className={styles.warning}>{data.data.open}</span>
                  <AiOutlineFolderOpen />
                </Card>

                <Card
                  footerClassName={styles.bgWarning}
                  footer={
                    <>
                      <div>On Hold</div>
                      <BiTrendingDown />
                    </>
                  }
                >
                  <span className={styles.warning}>{data.data.hold}</span>
                  <GoStop />
                </Card>

                <Card
                  footerClassName={styles.bgSuccess}
                  footer={
                    <>
                      <div>Closed</div>
                      <BiTrendingUp />
                    </>
                  }
                >
                  <span className={styles.success}>{data.data.close}</span>
                  <GoThumbsup />
                </Card>

                <Card
                  footerClassName={styles.bgSuccess}
                  footer={
                    <>
                      <div>Assigned</div>
                      <BiTrendingUp />
                    </>
                  }
                >
                  <span className={styles.success}>{data.data.assigned}</span>
                  <FaUserMd />
                </Card>

                <Card
                  footerClassName={styles.bgSuccess}
                  footer={
                    <>
                      <div>Replies</div>
                      <BiTrendingUp />
                    </>
                  }
                >
                  <span className={styles.success}>{data.data.replies}</span>
                  <FaComment />
                </Card>

                <Card
                  footerClassName={styles.bgSuccess}
                  footer={
                    <>
                      <div>Unresolved</div>
                      <BiTrendingUp />
                    </>
                  }
                >
                  <span className={styles.success}>{data.data.tickets_per_day}</span>
                  <MdToday />
                </Card>
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
