import * as React from 'react';
import { Ticket } from '../../Types';
import { Spinner } from '../../../components/Spinner';
import { MdRssFeed } from 'react-icons/all';
import { Card } from '../../../components/card/Card';
import styles from './LatestActivity.module.scss';
import { Button } from '../../../components/button/Button';

interface LatestActivity {
  data: { latest_activity: Ticket[] };
  handleGetAllActivity: () => void;
  showFetchAllButton: boolean;
  loading: boolean;
}

export const LatestActivity = (props: LatestActivity) => {
  return (
    <>
      <Card
        className={styles.container}
        header="Latest Activity"
        footer={
          <>
            {props.loading && <Spinner />}
            {!props.loading && props.showFetchAllButton && (
              <Button variant="primary" onClick={props.handleGetAllActivity}>
                View all activities
              </Button>
            )}
          </>
        }
      >
        <div className={styles.content}>
          {props?.data?.latest_activity.map(row => {
            return (
              <div key={row.id} className={styles.row}>
                <div>
                  <MdRssFeed />
                </div>
                <div>
                  <a href={`/tickets/${row.id}`} className={'text-decoration-none'}>
                    <h6>{row.subject}</h6>
                  </a>
                </div>
                <div>{new Date(row.created_at).toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
};
