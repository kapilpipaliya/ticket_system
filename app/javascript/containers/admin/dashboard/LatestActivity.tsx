import * as React from 'react';
import { Log, Ticket } from '../../Types';
import { Spinner } from '../../../components/Spinner';
import { MdRssFeed } from 'react-icons/all';
import { Card } from '../../../components/card/Card';
import { Button } from '../../../components/button/Button';
import styles from './LatestActivity.module.scss';
import { SpinnerModal } from '../../../components/SpinnerModal';

interface LatestActivity {
  data: { latest_activity: Log[] };
  handleGetAllActivity: () => void;
  showFetchAllButton: boolean;
  loading: boolean;
}

export const LatestActivity = (props: LatestActivity) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>Latest Activity</div>
        <div className={styles.content}>
          <SpinnerModal loading={props.loading} />
          {props?.data?.latest_activity?.map(row => {
            return (
              <div key={row.id} className={styles.row}>
                <MdRssFeed className={styles.feedIcon} />
                <div>
                  <a className={styles.link}>
                    <span className={styles.title}>{row.activity}</span>
                  </a>
                </div>
                <div className={styles.lastColumn}>
                  {new Date(row.created_at).toLocaleString(undefined, { hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })}
        </div>
        {!props?.data?.latest_activity.length && <div className={styles.noData}>No Data...</div>}
        {!props.loading && props.showFetchAllButton && !!props?.data?.latest_activity.length && (
          <div className={styles.footer}>
            <Button variant="secondary" onClick={props.handleGetAllActivity}>
              View all activities
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
