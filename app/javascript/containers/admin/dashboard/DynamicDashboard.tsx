import { ButtonGroup, Col, Container, Row } from 'react-bootstrap';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { fetchDashBoardData, fetchLastActivityData } from '../../../services/serviceDashBoard';
import { DateSelectDropdown } from './DateSelectDropdown';
import { Spinner } from '../../../components/Spinner';

import { LatestActivity } from './LatestActivityParams';

import { BiTrendingDown, BiTrendingUp } from 'react-icons/bi';
import {
  AiOutlineFolderOpen,
  FaComment,
  FaResolving,
  FaUserMd,
  GoAlert,
  GoStop,
  GoThumbsup,
  MdToday,
  VscAdd
} from 'react-icons/all';
import styles from './DynamicDashboard.module.scss'
import {Card} from "../../../components/card/Card";

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
              <div className={styles.cards}>
              
                  <Card
                       style={{margin: '10px 10px 0 0'}}
                      footer={
                        <>
                          <div>Unresolved</div>
                          <BiTrendingDown />
                        </>
                      }
                  > {data.data.unresolved_count}
                    <FaResolving /></Card>
              
              
                  <Card
                       style={{margin: '10px 10px 0 0'}}
                      footer={
                        <>
                          <div>New Tickets</div>
                          <BiTrendingDown />
                        </>
                      }
                  > {data.data.new_tickets}
                    <VscAdd /></Card>
              
               
                  <Card
                       style={{margin: '10px 10px 0 0'}}
                      footer={
                        <>
                          <div>Open</div>
                          <BiTrendingDown />
                        </>
                      }
                  > {data.data.open}
                    <AiOutlineFolderOpen /></Card>
        
               
                  <Card
                       style={{margin: '10px 10px 0 0'}}
                      footer={
                        <>
                          <div>On Hold</div>
                          <BiTrendingDown />
                        </>
                      }
                  > {data.data.hold}
                    <GoStop /></Card>
            
            
                  <Card
                       style={{margin: '10px 10px 0 0'}}
                      footer={
                        <>
                          <div>Closed</div>
                          <BiTrendingUp />
                        </>
                      }
                  > {data.data.close}
                    <GoThumbsup /></Card>
           
             
                  <Card
                       style={{margin: '10px 10px 0 0'}}
                      footer={
                        <>
                          <div>Assigned</div>
                          <BiTrendingUp />
                        </>
                      }
                  > {data.data.assigned}
                    <FaUserMd /></Card>
       
             
                  <Card
                       style={{margin: '10px 10px 0 0'}}
                      footer={
                        <>
                          <div>Replies</div>
                          <BiTrendingUp />
                        </>
                      }
                  > {data.data.replies}
                    <FaComment /></Card>
           
         
                  <Card
                       style={{margin: '10px 10px 0 0'}}
                      footer={
                        <>
                          <div>Unresolved</div>
                          <BiTrendingUp />
                        </>
                      }
                  > {data.data.tickets_per_day}
                    <MdToday /></Card>
                
              </div>
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
