import React from 'react';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

export default () => (
  <div className={styles.main} style={{ height: '100vh', width: '100%' }}>
    <div className={styles.section}>
      <span>500</span>
      <p>
        {formatMessage({ id: 'app.exception.description.500' })}
        <Link to='/'> {formatMessage({ id: 'app.exception.back' })}</Link>
      </p>
    </div>
  </div>

);

