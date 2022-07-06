import React, { Component } from 'react';
import styles from './index.less';
import { Button, Input, List, message } from 'antd';
import { connect } from 'dva';
import DatabaseModal from '@/pages/components/DatabaseModal';
import DMessage from '@/components/Alert/DMessage';
import GeneratorModal from '@/pages/components/GeneratorModal';
import { apiServer } from '@/utils/constants';
import { getApi } from './services/services';


const { Search } = Input;

@connect(({ generator }) => ({
  generator,
}))
class CodeGenerate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tables: [],
      selectedKeys: [],
      generatorVisible: false,
      dataConnections: [],
      currentDatabase: undefined,
      dbVisible: false,
      modalData: {
        isUrlLocked: true,
        type: 'MySQL',
        version: '5.1',
        name: undefined,
        description: undefined,
        database: undefined,
        schema: 'public',
        ip: undefined,
        port: '3306',
        username: undefined,
        password: undefined,
        url: undefined,
      },
      errorVisible: false,
      errorMessage: undefined,
      errorDetail: undefined,
      generatorData: {
        moduleName: undefined,
        packageName: undefined,
        author: undefined,
        tables: [],
      },
      loading: false,
    };
  }

  componentDidMount() {
    this.findAll();
  }

  findAll = () => {
    this.props.dispatch({
      type: 'generator/getDataConnections',
      callback: response => {
        if (response && response.length > 0) {
          this.findTables(response[0].id);
          this.setState({
            dataConnections: response,
            currentDatabase: response[0].id,
          });
        }
      },
    });
  };

  findTables = currentDatabase => {
    this.props.dispatch({
      type: 'generator/findTables',
      payload: {
        dataConnectionId: currentDatabase,
      },
      callback: response => {
        if (response && response.code === 'SUCCEED') {
          this.setState({
            tables: response.data,
          });
        } else {
          message.error(response.message);
        }
      },
    });
  };

  databaseChange = id => {
    this.findTables(id);
    this.generator();

    this.setState({
      currentDatabase: id,
    });
  };

  generator = () => {
    this.setState({
      generatorVisible: true,
    });
  };

  openDbModal = record => {
    if (record.id) {
      const modalData = { ...record };
      this.setState({
        chooseVisible: false,
        dbVisible: true,
        modalData,
      });
    } else {
      const initData = {
        type: 'MySQL',
        version: '5.1',
        name: undefined,
        description: undefined,
        database: undefined,
        schema: 'public',
        ip: undefined,
        port: '3306',
        username: undefined,
        password: undefined,
        url: undefined,
      };

      this.setState({
        chooseVisible: false,
        dbVisible: true,
        urlEditable: false,
        modalData: initData,
      });
    }
  };

  onFormChange = (key, value) => {
    const { modalData } = this.state;
    modalData[key] = value;
    if (key === 'type') {
      modalData['version'] = undefined;
    }

    this.setState({
      modalData,
    });
  };

  testConnect = () => {
    if (this.validate()) {
      this.setState({
        testLoading: true,
      });
      const { modalData } = this.state;
      this.props.dispatch({
        type: 'generator/testConnect',
        payload: {
          data: modalData,
        },
        callback: response => {
          if (response.code === 'SUCCEED') {
            message.success('连接成功');
          } else {
            this.setState({
              errorTitle: '连接失败',
              errorMessage: response.message,
              errorDetail: response.detail,
              errorVisible: true,
              submitLoading: false,
            });
          }
          this.setState({
            testLoading: false,
          });
        },
      });
    }
  };

  onSubmit = () => {
    if (this.validate()) {
      this.setState({
        submitLoading: true,
      });

      const { modalData } = this.state;

      this.props.dispatch({
        type: modalData.id ? 'generator/edit' : 'generator/save',
        payload: {
          data: modalData,
        },
        callback: (response) => {
          if (response.code === 'SUCCEED') {
            message.success('操作成功');
            this.findAll();
            this.setState({
              dbVisible: false,
              submitLoading: false,
            });
          } else {
            this.setState({
              errorTitle: '连接失败',
              errorMessage: response.message,
              errorDetail: response.detail,
              errorVisible: true,
              submitLoading: false,
            });
          }
        },
      });
    }
  };

  validate = () => {
    const { name, database, ip, port, username, password, version } = this.state.modalData;
    if (!name || name.trim().length === 0) {
      message.error('请输入连接名称');
      return false;
    } else if (!version || version.trim().length === 0) {
      message.error('请选择数据库版本');
      return false;
    } else if (!database || database.trim().length === 0) {
      message.error('请输入数据库名称');
      return false;
    } else if (!ip || ip.trim().length === 0) {
      message.error('请输入IP地址');
      return false;
    } else if (!port || port.trim().length === 0) {
      message.error('请输入端口号');
      return false;
    } else if (!username || username.trim().length === 0) {
      message.error('请输入用户名');
      return false;
    } else if (!password || password.trim().length === 0) {
      message.error('请输入密码');
      return false;
    }
    return true;
  };

  onUrlEditableChange = (value) => {
    this.setState({
      urlEditable: value,
    });
  };

  onCancel = () => {
    this.setState({
      sheet: undefined,
      submitLoading: false,
      testLoading: false,
      dbVisible: false,
      fileVisible: false,
      loadFileVisible: false,
      chooseVisible: false,
      sheetVisible: false,
    });
  };

  onSearch = value => {
    let query = {};
    query['name'] = value;

    this.props.dispatch({
      type: 'generator/queryWhere',
      payload: {
        queryBuilder: query,
      }, callback: (response) => {
        this.setState({
          dataConnections: response,
        });
      },
    });
  };

  errorClose = () => {
    this.setState({
      errorVisible: false,
      errorTitle: undefined,
      status: 'error',
      errorMessage: undefined,
      errorDetail: undefined,
    });
  };

  onTableChange = data => {
    this.setState({
      tables: data,
    });
  };

  onSelectChange = keys => {
    this.setState({
      selectedKeys: keys,
    });
  };

  onGeneratorChange = (key, value) => {
    const { generatorData } = this.state;
    generatorData[key] = value;

    this.setState({
      generatorData,
    });
  };

  generatorSave = () => {
    const { generatorData, currentDatabase, tables, selectedKeys } = this.state;
    const filterTables = [];

    const regExp = new RegExp('^[a-zA-Z_]{1}\\w{0,100}$');

    const badTableName = [];
    selectedKeys.forEach(selectedKey => {
      if (selectedKey.match(regExp)) {
        const filterTable = tables.filter(item => item.tableName === selectedKey);
        if (filterTable && filterTable.length > 0) {
          filterTables.push(filterTable[0]);
        }
      } else {
        badTableName.push(selectedKey);
      }
    });

    if (badTableName.length > 0) {
      message.error('存在不合法的表名：' + badTableName.join());
      return;
    }

    if (filterTables.length === 0) {
      message.error('请选择需要生成代码的数据库表');
      return;
    }

    generatorData['tables'] = filterTables;
    generatorData['dataConnectionId'] = currentDatabase;

    const url = `${apiServer + getApi().generator}`;

    this.setState({
      loading: true,
    });

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(generatorData),
      credentials: 'include',//使用"include"表示无论是否跨域，都会携带cookie
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(res => res.blob())
      .then(blob => {
        this.setState({
          loading: false,
        });
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'generator-code.zip';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  };

  generatorCancel = () => {
    this.setState({
      generatorData: {},
      generatorVisible: false,
    });
  };

  render() {
    const {
      tables,
      generatorVisible,
      dataConnections,
      currentDatabase,
      modalData,
      dbVisible,
      submitLoading,
      testLoading,
      generatorData,
    } = this.state;

    return <div className={styles['main']}>
      <Button className={styles['add']} onClick={this.openDbModal} type={'primary'}>新建</Button>
      <div className={styles['search']}>
        <Search
          placeholder='请输入搜索内容'
          allowClear
          enterButton='搜索'
          onSearch={this.onSearch}
        />
      </div>

      <List
        className={styles['list']}
        grid={{ gutter: 4, column: 3 }}
        dataSource={dataConnections}
        renderItem={(item, index) => (
          <List.Item
            key={index}
          >
            <div className={styles['item']}>
              <div>
                <span title={'一键生成代码'} className={styles['title']} onClick={() => this.databaseChange(item.id)}>{item.name}</span>
                <span className={styles['update']} onClick={() => this.openDbModal(item)}>修改</span>
              </div>
              <div>{`${item.ip}/${item.database}`}</div>
            </div>
          </List.Item>
        )}
      />

      <GeneratorModal
        tables={tables}
        visible={generatorVisible}
        onTableChange={this.onTableChange}
        onSelectChange={this.onSelectChange}
        onFormChange={this.onGeneratorChange}
        data={generatorData}
        onSubmit={this.generatorSave}
        onCancel={this.generatorCancel}
        loading={this.state.loading}
      />

      <DatabaseModal
        style={{ top: 100 }}
        data={modalData}
        visible={dbVisible}
        onFormChange={this.onFormChange}
        testConnect={this.testConnect}
        onSubmit={this.onSubmit}
        onEdit={this.onEdit}
        urlEditable={this.state.urlEditable}
        onUrlEditableChange={this.onUrlEditableChange}
        onCancel={this.onCancel}
        testLoading={testLoading}
        submitLoading={submitLoading}
      />

      <DMessage
        style={{ marginTop: 80 }}
        visible={this.state.errorVisible}
        status={'ERROR'}
        title={this.state.errorTitle}
        message={this.state.errorMessage}
        detail={this.state.errorDetail}
        onCancel={this.errorClose}
      />

    </div>;
  }
}

export default CodeGenerate;
