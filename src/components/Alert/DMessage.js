import React, { Component } from 'react';
import { Button, Modal } from 'antd';

class DMessage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showDetail: false,
    };
  }

  showDetail = () => {
    this.setState({
      showDetail: true,
    });
  };

  onClose = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
    this.setState({
      showDetail: false,
    })
  };

  render() {
    const { visible, status, title, message, detail, style } = this.props;

    return (
      <Modal
        style={{ ...style }}
        width={500}
        visible={visible}
        title={null}
        footer={null}
        closable={false}
      >
        <div style={{ display: 'flex' }}>
          {status === 'SUCCEED' ? <img src={'images/success.svg'} style={{ width: 30, height: 30, marginRight: 10 }}/>
            : <img src={'images/error.svg'} style={{ width: 30, height: 30, marginRight: 10 }}/>
          }

          <div style={{ width: '90%' }}>
            <h3>{title}</h3>
            <span>{message}</span>
            <div style={{ marginTop: '10px' }}>
              {detail && detail.length > 0 && !this.state.showDetail ? <a onClick={this.showDetail}>>>查看详细信息</a>
                : null}

              {this.state.showDetail ? <span style={{ color: '#838487' }}>{detail}</span>
                : null}

            </div>
          </div>
        </div>

        <div style={{ width: '100%', textAlign: 'right', marginTop: '20px' }}>
          <Button type={'primary'} onClick={this.onClose}>知道了</Button>
        </div>
      </Modal>
    );
  }

}

export default DMessage;