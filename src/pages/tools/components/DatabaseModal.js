import React, { Component } from 'react';
import { Button, Input, message, Modal, Select, Space } from 'antd';
import { EditOutlined, LockOutlined } from '@ant-design/icons';
import styles from './DatabaseModal.less';

const { Option } = Select;

const MYSQL = 'MySQL';
const ORACLE = 'Oracle';
const SQL_SERVER = 'SQLServer';
const POSTGRESQL = 'PostgreSQL';
const TBASE = 'TBase';

class DatabaseModal extends Component {

  constructor(props) {
    super(props);
  }

  testConnect = () => {
    if (this.props.testConnect) {
      this.props.testConnect();
    }
  };

  handleOk = () => {
    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  };

  handleCancel = () => {
    const { testLoading, submitLoading } = this.props;
    if (testLoading || submitLoading) {
      message.error('正在尝试连接数据库，请稍候');
      return;
    }
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  onLabelChange = labels => {
    const { allLabels } = this.props;
    const dataLabels = [];
    labels.forEach(label => {
      const item = allLabels.filter(item => item.name === label);
      if (item && item.length > 0) {
        dataLabels.push(item[0]);
      }
    });
    if (this.props.onFormChange) {
      this.props.onFormChange('dataLabels', dataLabels);
    }
  };

  onFormChange = (key, value) => {
    // url需要特殊处理
    if (key === 'url') {
      let url = this.urlBuilder();
      url = url.replace(/undefined/g, '');
      const index = value.lastIndexOf(url);
      if (index !== -1) {
        let append = value.substr(index + url.length);
        this.props.onFormChange(key, url + append);
      } else {
        message.error('URL前置部分由系统生成，无法修改');
      }
    } else {
      this.props.onFormChange(key, value);
    }
  };

  onUrlEditableChange = value => {
    if (this.props.onUrlEditableChange) {
      this.props.onUrlEditableChange(value);
    }
  };

  onDatabaseTypeChange = value => {
    const type = value;
    let port;
    let defaultVersion;
    switch (type) {
      case MYSQL:
        port = '3306';
        defaultVersion = '5.1';
        break;
      case POSTGRESQL:
        port = '5432';
        defaultVersion = '9.2.23';
        break;
      case TBASE:
        port = '5432';
        defaultVersion = '42.2.5';
        break;
      case ORACLE:
        port = '1521';
        defaultVersion = '10g';
        break;
      case SQL_SERVER:
        port = '1433';
        defaultVersion = '2008R2';
        break;
    }
    this.props.onFormChange('type', type);
    this.props.onFormChange('port', port);
    this.props.onFormChange('version', defaultVersion);
  };

  urlBuilder = () => {
    const { database, schema, ip, port, type } = this.props.data;
    let url = '';
    switch (type) {
      case MYSQL:
        url = 'jdbc:mysql://' + ip + ':' + port + '/' + database;
        break;
      case POSTGRESQL:
        url = 'jdbc:postgresql://' + ip + ':' + port + '/' + database + '?currentSchema=' + schema;
        break;
      case TBASE:
        url = 'jdbc:postgresql://' + ip + ':' + port + '/' + database + '?currentSchema=' + schema;
        break;
      case ORACLE:
        url = 'jdbc:oracle:thin:@' + ip + ':' + port + '/' + database;
        break;
      case SQL_SERVER:
        url = 'jdbc:sqlserver://' + ip + ':' + port + ';DatabaseName=' + database;
        break;
      default:
    }
    url = url.replace(/undefined/g, '');
    return url;
  };

  render() {
    const { allLabels = [], testLoading, submitLoading, data, urlEditable } = this.props;
    const {
      name,
      database,
      schema,
      ip,
      port,
      type,
      username,
      password,
      dataLabels,
      version,
    } = data;

    const versionOption = [];
    switch (type) {
      case MYSQL:
        versionOption.push(<Option value={'5.1'} key={1}>5.1</Option>);
        versionOption.push(<Option value={'5.5'} key={2}>5.5</Option>);
        versionOption.push(<Option value={'5.6'} key={3}>5.6</Option>);
        versionOption.push(<Option value={'8.0'} key={4}>8.0</Option>);
        break;
      case ORACLE:
        versionOption.push(<Option value={'10g'} key={1}>10g</Option>);
        versionOption.push(<Option value={'11g'} key={2}>11g</Option>);
        versionOption.push(<Option value={'12c'} key={3}>12c</Option>);
        break;
      case POSTGRESQL:
        versionOption.push(<Option value={'9.2.23'} key={1}>9.2.23</Option>);
        break;
      case TBASE:
        versionOption.push(<Option value={'9.2.23'} key={1}>42.2.5</Option>);
        break;
      case SQL_SERVER:
        versionOption.push(<Option value={'2008R2'} key={1}>2008R2</Option>);
        break;
    }

    let { url } = data;
    if (!url) {
      url = this.urlBuilder();
    }

    const labelOptions = [];
    allLabels.forEach((item) => {
      labelOptions.push(
        <Option value={item.name} key={item.id}>
          {item.name}
        </Option>,
      );
    });

    const labels = [];

    dataLabels !== undefined && dataLabels.forEach((dataLabel) => {
      labels.push(dataLabel.name);
    });

    return (
      <Modal
        width={600}
        style={{ ...this.props.style }}
        title={data.id ? '编辑数据连接' : '创建数据连接'}
        visible={this.props.visible}
        destroyOnClose={true} footer={null}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <Space direction='vertical'>
          <Space>
            <div className={styles['label']}>连接名称</div>
            <Input
              style={{ width: 386 }}
              value={name}
              onChange={(e) => this.onFormChange('name', e.target.value)}
              placeholder='连接名称'
              maxLength={100}
            />
          </Space>
          <Space>
            <div className={styles['label']}>数据库引擎</div>
            <Select
              defaultValue={type}
              style={{ width: 386 }}
              value={type}
              onChange={this.onDatabaseTypeChange}
            >
              <Option value={MYSQL} key={MYSQL}>{MYSQL}</Option>
              <Option value={POSTGRESQL} key={POSTGRESQL}>{POSTGRESQL}</Option>
              <Option value={TBASE} key={TBASE}>{TBASE}</Option>
              <Option value={ORACLE} key={ORACLE}>{ORACLE}</Option>
              <Option value={SQL_SERVER} key={SQL_SERVER}>{SQL_SERVER}</Option>
            </Select>
          </Space>

          <Space>
            <div className={styles['label']}>数据库版本</div>
            <Select
              style={{ width: 386 }}
              value={version}
              onChange={(value) => this.onFormChange('version', value)}
            >
              {versionOption}
            </Select>
          </Space>

          <Space>
            <div className={styles['label']}>IP地址</div>
            <Input
              style={{ width: 150 }}
              value={ip}
              onChange={(e) => this.onFormChange('ip', e.target.value)}
              placeholder='IP地址'
              maxLength={100}
            />
            <div style={{ width: 70, textAlign: 'right', color: '#999' }}><span
              style={{ color: 'red', marginRight: '2px' }}>*</span><span>端口号</span></div>
            <Input
              style={{ width: 150 }}
              value={port}
              onChange={(e) => this.onFormChange('port', e.target.value)}
              placeholder='端口号'
              maxLength={100}
            />
          </Space>
          <Space>
            <div className={styles['label']}>用户名</div>
            <Input
              style={{ width: 386 }}
              value={username}
              onChange={(e) => this.onFormChange('username', e.target.value)}
              placeholder='用户名'
              maxLength={100}
            />
          </Space>
          <Space>
            <div className={styles['label']}>密码</div>
            <Input.Password
              style={{ width: 386 }}
              value={password}
              onChange={(e) => this.onFormChange('password', e.target.value)}
              placeholder='密码'
              maxLength={100}
            />
          </Space>

          <div>
            <div style={{ display: type === POSTGRESQL || type === TBASE ? 'flex' : 'none' }}>
              <div className={styles['label']} style={{ marginTop: '5px' }}>
                数据库名
              </div>
              <Input
                style={{ width: 150, marginLeft: '8px' }}
                value={database}
                onChange={(e) => this.onFormChange('database', e.target.value)}
                placeholder='数据库名'
                maxLength={100}
              />
              <div style={{ width: '78px', textAlign: 'right', paddingTop: '5px' }}>
                <span style={{ color: 'red' }}>*</span>
                <span style={{ color: '#999' }}>模式</span>
              </div>
              <Input
                style={{ width: 150, marginLeft: '8px' }}
                value={schema}
                onChange={(e) => this.onFormChange('schema', e.target.value)}
                placeholder='模式'
                maxLength={100}
              />
            </div>
            <div style={{ display: type !== POSTGRESQL && type !== TBASE ? 'flex' : 'none' }}>
              <div className={styles['label']} style={{ marginTop: '5px' }}>数据库名</div>
              <Input
                style={{ width: 386, marginLeft: '8px' }}
                value={database}
                onChange={(e) => this.onFormChange('database', e.target.value)}
                placeholder='数据库名'
                maxLength={100}
              />
            </div>
          </div>

          <Space>
            <div className={styles['label']}>url</div>
            <Input
              addonAfter={
                urlEditable ?
                  <a onClick={() => this.onUrlEditableChange(false)}>
                    <EditOutlined />
                  </a>
                  : <a onClick={() => this.onUrlEditableChange(true)}>
                    <LockOutlined />
                  </a>
              }
              readOnly={!urlEditable}
              style={{ width: 386 }}
              value={url}
              onChange={(e) => this.onFormChange('url', e.target.value)}
              placeholder='url'
              maxLength={200}
            />
          </Space>
        </Space>
        <div style={{ margin: '40px 40px 0px 0px', textAlign: 'right' }}>
          <Button onClick={this.testConnect} loading={testLoading}>测试连接</Button>
          <Button
            style={{ marginLeft: '10px' }}
            type={'primary'}
            onClick={this.handleOk}
            loading={submitLoading}
          >
            确定
          </Button>
          <Button style={{ marginLeft: '10px' }} onClick={this.handleCancel}>取消</Button>
        </div>
      </Modal>
    );
  }

}

export default DatabaseModal;
