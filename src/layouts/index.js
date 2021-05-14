import React, { Component } from 'react';
import styles from './index.less';

class BasicLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loginVisible: false,
    };
  }

  render() {

    return (
      <div>
        <div className={styles['header']}>
          <img src={'/images/logo.svg'} width={40} />
          <div style={{ color: '#fff', fontSize: 24, fontFamily: '楷体', margin: '6px 0px 0px 20px' }}>多平台代码生成工具</div>
        </div>

        {this.props.children}

        <div className={styles['footer']}>
          <div style={{ color: '#fff', marginBottom: '10px' }}>Copyright © 2020 平平技术有限公司</div>
          <a style={{ marginLeft: '20px', color: '#3765a1' }}>邮箱：weipingdeng@qq.com</a>
          <a style={{ marginLeft: '20px', color: '#3765a1' }}>QQ: 1768159807</a>
          <a style={{ marginLeft: '20px', color: '#3765a1' }}>电话/微信: 15502791235</a>
        </div>

      </div>
    );
  }
}

export default BasicLayout;
