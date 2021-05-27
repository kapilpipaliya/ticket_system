import * as React from 'react';
import clsx from 'clsx';

import blueDotLeftBars from '../../../assets/icons/dots/blue-dot-left-bars.svg';
import yellowDotRightShield from '../../../assets/icons/dots/yellow-dot-right-shield.svg';
import zPicture from '../../../assets/images/z-picture.png';
import styles from './HomePage.module.scss';

export const HomePage = () => (
  <>
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.firstColumn}>
          <h1>Lets' talk</h1>
          <p>Didn't Find Any Solution? Just create a ticket. our team will respond in 24 hours.</p>
          <div className={styles.buttonGroup}>
            <a className={clsx(styles.button, styles.primaryButton)} href="/tickets/new">
              Create Ticket
            </a>
            <a className={clsx(styles.button, styles.secondaryButton)} href="/tickets/new">
              Learn More
            </a>
          </div>
        </div>
        <div className={styles.secondColumn}>
          <img className={styles.firstImage} src={yellowDotRightShield} alt="" />
          <img className={styles.secondImage} src={zPicture} alt="" />
          <img className={styles.thirdImage} src={blueDotLeftBars} alt="" />
        </div>
      </div>
    </div>
  </>
);
export default HomePage;
