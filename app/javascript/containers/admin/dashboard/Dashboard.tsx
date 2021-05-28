import * as React from 'react';
import { DynamicDashboard } from './DynamicDashboard';
import { FixedDashboard } from './FixedDashboard';
import styles from './Dashboard.module.scss';

export const Dashboard = () => (
  <div className={styles.container}>
    <FixedDashboard />
    <DynamicDashboard />
  </div>
);
