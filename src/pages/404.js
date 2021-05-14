import React from 'react';
import styles from './index.less';

export default () => (
  <div className={styles['notfound']}>
    <div>
      <img src={'/images/404.svg'} width={130} />
    </div>

    <div style={{ marginLeft: 70 }}>
      <div style={{ marginBottom: '20px' }}>
        <span
          style={{
            fontSize: '34px',
            fontWeight: 700,
            lineHeight: 1.1,
            color: '#454e57',
          }}
        >
          页面走丢了
        </span>
      </div>
      <div>
        <span
          style={{
            fontSize: '16px',
            color: '#64707d',
            margin: '12px 0px',
          }}
        >
          您要查找的页面不在这里。 要不尝试返回<a href={'/'}>首页</a>？
        </span>

      </div>
    </div>
  </div>
);

