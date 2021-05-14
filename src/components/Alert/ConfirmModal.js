import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import styles from './ConfirmModal.less';


class ConfirmModal extends Component {

  onCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  onOk = () => {
    if (this.props.onOk) {
      this.props.onOk();
    }
  };

  render() {
    const { visible, style, contentStyle, okText = '确定', cancelText = '取消', title = '确认要删除吗', content } = this.props;

    return (
      <Modal
        style={{ width: 500, height: 200, ...style }}
        width={500}
        visible={visible}
        title={null}
        footer={null}
        closable={false}
      >
        <div>
          <div style={{ display: 'flex' }}>
            <img src="/images/warning.svg" style={{ width: 25, height: 25 }} />
            <span className={styles.title}>{title}</span>
          </div>
          <div style={{ ...contentStyle, marginLeft: '38px' }}>{content}</div>
        </div>
        <div style={{ width: '100%', textAlign: 'right', marginTop: '20px' }}>
          <Button onClick={this.onCancel} style={{ marginRight: '10px' }}>{cancelText}</Button>
          <Button type={'primary'} onClick={this.onOk}>{okText}</Button>
        </div>
      </Modal>
    );
  }

}

export default ConfirmModal;