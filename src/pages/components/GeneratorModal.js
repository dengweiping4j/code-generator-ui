import React, { Component } from 'react';
import { Input, Modal, Select, Spin } from 'antd';
import EditTable from '@/components/EditTable/EditTable';
import styles from './GeneratorModal.less';

const { Option } = Select;

class GeneratorModal extends Component {

  onTableChange = data => {
    if (this.props.onTableChange) {
      this.props.onTableChange(data);
    }
  };

  onSelectChange = keys => {
    if (this.props.onSelectChange) {
      this.props.onSelectChange(keys);
    }
  };

  onFormChange = (key, value) => {
    if (this.props.onFormChange) {
      this.props.onFormChange(key, value);
    }
  };

  handleCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  onSubmit = () => {
    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  };

  render() {
    const { visible, tables = [], data } = this.props;

    const columns = [
      {
        title: '序号',
        dataIndex: 'sn',
        key: 'sn',
        editable: false,
        render: (text, record, index) => index + 1,
      },
      {
        title: '表名',
        dataIndex: 'tableName',
        key: 'tableName',
        editable: false,
      },
      {
        title: '备注',
        dataIndex: 'tableComment',
        key: 'tableComment',
        type: 'input',
      },
    ];

    return <Modal
      width={800}
      style={{ ...this.props.style }}
      title={'代码生成'}
      visible={visible}
      destroyOnClose={true}
      maskClosable={false}
      onOk={this.onSubmit}
      okText={'生成'}
      onCancel={this.handleCancel}
      cancelText={'取消'}
    >
      <Spin delay={500} spinning={this.props.loading} tip={'代码生成中'}>

        <div className={styles['item']}>
          <span className={styles['label']}>项目名称：</span>
          <Input
            key={'moduleName'}
            value={data['moduleName']}
            placeholder={'请填写项目名称'}
            onChange={(e) => this.onFormChange('moduleName', e.target.value)}
          />
        </div>

        <div className={styles['item']}>
          <span className={styles['label']}>包名：</span>
          <Input
            key={'packageName'}
            value={data['packageName']}
            placeholder={'请填写包路径'}
            onChange={(e) => this.onFormChange('packageName', e.target.value)}
          />
        </div>

        <div className={styles['item']}>
          <span className={styles['label']}>作者：</span>
          <Input
            key={'author'}
            value={data['author']}
            placeholder={'请填写作者姓名'}
            onChange={(e) => this.onFormChange('author', e.target.value)}
          />
        </div>

        <div className={styles['item']}>
          <span className={styles['label']}>ORM框架：</span>
          <Select
            style={{ width: '100%' }}
            placeholder={'请选择ORM框架'}
            value={data['generatorType']}
            onChange={value => this.onFormChange('generatorType', value)}
          >
            <Option value={'jpa'} key={1}>JPA</Option>
            <Option value={'mybatis'} key={2}>MyBatis</Option>
            <Option value={'mybatis-plus'} key={3}>MyBatis-Plus</Option>
          </Select>
        </div>

        <EditTable
          rowKey={'tableName'}
          style={{ maxHeight: '300px', overflow: 'auto', marginTop: '20px' }}
          dataSource={tables}
          columns={columns}
          pagination={false}
          isSelectRows={true}
          onSelectChange={this.onSelectChange}
          onChange={this.onTableChange}
          isSearch={true}
          searchKeys={['tableName']}
        />

      </Spin>
    </Modal>;
  }

}

export default GeneratorModal;
