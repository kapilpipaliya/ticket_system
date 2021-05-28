import * as React from 'react';
import { Log } from '../../Types';
import { MdRssFeed } from 'react-icons/all';

import { Button } from '../../../components/button/Button';
import { SpinnerModal } from '../../../components/spinner/SpinnerModal';
import { getLocalTimeDate } from '../../utils';
import styles from './LatestActivity.module.scss';

interface LatestActivity {
  data: { latest_activity: Log[] };
  handleGetAllActivity: () => void;
  showFetchAllButton: boolean;
  loading: boolean;
}

export const LatestActivity = (props: LatestActivity) => {
  const { data, handleGetAllActivity, showFetchAllButton, loading } = props;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>Latest Activity</div>
        <div className={styles.content}>
          <SpinnerModal loading={loading} />
          {data?.latest_activity?.map(row => (
            <div key={row.id} className={styles.row}>
              <MdRssFeed className={styles.feedIcon} />
              <div>
                <a className={styles.link}>
                  <span className={styles.title}>{row.activity}</span>
                </a>
              </div>
              <div className={styles.lastColumn}>{getLocalTimeDate(new Date(row.created_at))}</div>
            </div>
          ))}
        </div>
        {!data?.latest_activity.length && <div className={styles.noData}>No Data...</div>}
        {!loading && showFetchAllButton && !!data?.latest_activity.length && (
          <div className={styles.footer}>
            <Button variant="secondary" onClick={handleGetAllActivity}>
              View all activities
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
