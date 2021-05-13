import { ButtonGroup, Col, Container, Row } from 'react-bootstrap';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { fetchDashBoardData, fetchLastActivityData } from '../../../services/serviceDashBoard';
import { DateSelectDropdown } from './DateSelectDropdown';
import { Spinner } from '../../../components/Spinner';

import { LatestActivity } from './LatestActivityParams';
import PageStatisticCard from '../../../components/statistic/PageStatisticCard';
import { BiTrendingDown, BiTrendingUp } from 'react-icons/bi';
import { AiOutlineFolderOpen, FaComment, FaResolving, FaUserMd, GoStop, GoThumbsup, MdToday, VscAdd } from 'react-icons/all';

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
      <Row>
        <Col xs={12} className="text-end mt-2 mb-2">
          <ButtonGroup>
            <DateSelectDropdown handleRangeSelect={handleOnDateChange} />
          </ButtonGroup>
          {/*<RangeDatePicker startDate={start} endDate={end} onChange={handleOnDateChange} />*/}
        </Col>
      </Row>
      {isLoading || isFetching || !data ? (
        <Spinner />
      ) : (
        <>
          {data?.data && (
            <>
              <Row>
                <Col>
                  <PageStatisticCard
                    params={{
                      iconClass: 'icon-trending-up',
                      iconName: <FaResolving />,
                      footerIcon: <BiTrendingDown />,
                      variant: 'warning',
                      title: '',
                      primaryText: data.data.unresolved_count,
                      secondaryText: 'Unresolved',
                    }}
                  />
                </Col>
                <Col>
                  <PageStatisticCard
                    params={{
                      iconClass: 'icon-trending-up',
                      iconName: <VscAdd />,
                      footerIcon: <BiTrendingDown />,
                      variant: 'warning',
                      title: '',
                      primaryText: data.data.new_tickets,
                      secondaryText: 'New Tickets',
                    }}
                  />
                </Col>
                <Col>
                  <PageStatisticCard
                    params={{
                      iconClass: 'icon-trending-up',
                      iconName: <AiOutlineFolderOpen />,
                      footerIcon: <BiTrendingDown />,
                      variant: 'warning',
                      title: '',
                      primaryText: data.data.open,
                      secondaryText: 'Open',
                    }}
                  />
                </Col>
                <Col>
                  <PageStatisticCard
                    params={{
                      iconClass: 'icon-trending-up',
                      iconName: <GoStop />,
                      footerIcon: <BiTrendingDown />,
                      variant: 'warning',
                      title: '',
                      primaryText: data.data.hold,
                      secondaryText: 'On Hold',
                    }}
                  />
                </Col>
                <Col>
                  <PageStatisticCard
                    params={{
                      iconClass: 'icon-trending-up',
                      iconName: <GoThumbsup />,
                      footerIcon: <BiTrendingUp />,
                      variant: 'success',
                      title: '',
                      primaryText: data.data.close,
                      secondaryText: 'Closed',
                    }}
                  />
                </Col>
                <Col>
                  <PageStatisticCard
                    params={{
                      iconClass: 'icon-trending-up',
                      iconName: <FaUserMd />,
                      footerIcon: <BiTrendingUp />,
                      variant: 'success',
                      title: '',
                      primaryText: data.data.assigned,
                      secondaryText: 'Assigned',
                    }}
                  />
                </Col>
                <Col>
                  <PageStatisticCard
                    params={{
                      iconClass: 'icon-trending-up',
                      iconName: <FaComment />,
                      footerIcon: <BiTrendingUp />,
                      variant: 'success',
                      title: '',
                      primaryText: data.data.replies,
                      secondaryText: 'Replies',
                    }}
                  />
                </Col>
                <Col>
                  <PageStatisticCard
                    params={{
                      iconClass: 'icon-trending-up',
                      iconName: <MdToday />,
                      variant: 'success',
                      title: '',
                      primaryText: data.data.tickets_per_day,
                      secondaryText: 'Tickets Per Day',
                      footerIcon: <BiTrendingUp />,
                    }}
                  />
                </Col>
              </Row>
              <Row className={'mt-1'}>
                <Col xl={12} md={12}>
                  <LatestActivity
                    data={lastActivityData?.data}
                    handleGetAllActivity={handleGetAllActivity}
                    showFetchAllButton={lastActivityCount != 0}
                    loading={lastActivityIsLoading || lastActivityIsFetching}
                  />
                </Col>
              </Row>
            </>
          )}
        </>
      )}
    </>
  );
}
