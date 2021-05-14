import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Form, Input, message, Popconfirm, Radio, Select, Table } from 'antd';
import styles from './EditTable.less';
import SearchInput from '@/components/SearchInput';

const EditableContext = React.createContext();
const { Option, OptGroup } = Select;

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
                        title,
                        editable,
                        type,
                        children,
                        dataIndex,
                        data,
                        width,
                        defaultValue,
                        maxLength,
                        record,
                        rowKey,
                        handleSave,
                        ...restProps
                      }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async e => {
    try {
      const values = await form.validateFields();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('保存单元格内容失败:', errInfo);
    }
  };

  const onChange = (value, dataIndex, maxLength) => {
    if (maxLength && value.length === maxLength) {
      message.error('输入内容达到最大可输入长度');
    }
    const data = {
      [dataIndex]: value,
    };
    handleSave({ ...record, ...data });
  };

  let childNode = children;
  if (editable) {
    if (record && record[dataIndex] !== undefined) {
      if ((typeof record[dataIndex]) === 'number') {
        defaultValue = parseInt(record[dataIndex]);
      } else {
        defaultValue = record[dataIndex];
      }
    }

    switch (type) {
      case 'input':
        childNode = (
          <Input
            defaultValue={defaultValue}
            style={width ? { width: width } : { display: 'flex' }}
            value={record[dataIndex]}
            maxLength={maxLength ? maxLength : 100}
            onPressEnter={save} onBlur={save}
            onChange={(e) => onChange(e.target.value, dataIndex, maxLength)}
          />);
        break;
      case 'select':
        const selectData = data;
        const selectChild = [];
        if (selectData && selectData.length > 0) {
          if (!defaultValue) {
            defaultValue = selectData[0].value;
          }
          selectData.forEach((item, index) => {
            selectChild.push(<Option value={item.value} key={index}>{item.label}</Option>);
          });
        }
        childNode = (<Select
          getPopupContainer={triggerNode => triggerNode.parentNode}
          defaultValue={defaultValue}
          style={width ? { width: width } : { display: 'flex' }}
          value={record[dataIndex]}
          onChange={(e) => onChange(e, dataIndex)}
        >
          {selectChild}
        </Select>);
        break;
      case 'groupSelect':
        const groupSelectData = data;
        const groupSelectChild = [];
        if (groupSelectData && groupSelectData.length > 0) {
          if (!defaultValue) {
            defaultValue = groupSelectData[0].options[0].value;
          }
          groupSelectData.forEach((item, index) => {
            const optGroup = <OptGroup label={item.label} key={`${item.label}_${index}`}>
              {item.options.map((option, index2) => {
                return <Option value={option.value} key={`${option.label}_${index}_${index2}`}>{option.label}</Option>;
              })}
            </OptGroup>;
            groupSelectChild.push(optGroup);
          });
        }
        childNode = (
          <Select
            getPopupContainer={triggerNode => triggerNode.parentNode}
            defaultValue={defaultValue}
            style={width ? { width: width } : { display: 'flex' }}
            value={record[dataIndex]}
            onChange={(e) => onChange(e, dataIndex)}
            showSearch
          >
            {groupSelectChild}
          </Select>
        );
        break;
      case 'radio':
        const radioData = data;
        const radioChild = [];
        if (radioData && radioData.length > 0) {
          if (defaultValue === undefined) {
            defaultValue = radioData[0].value;
          }
          radioData.forEach((item, index) => {
            radioChild.push(<Radio value={item.value} key={index}>{item.label}</Radio>);
          });
        }
        childNode = (<Radio.Group
          defaultValue={defaultValue}
          style={width ? { width: width } : { display: 'flex' }}
          value={record[dataIndex]}
          onChange={(e) =>
            onChange(e.target.value, dataIndex)}
        >
          {radioChild}
        </Radio.Group>);
        break;
      case 'checkbox':
        childNode = (<Checkbox
          checked={record[dataIndex]}
          style={width ? { width: width } : { display: 'flex' }}
          onChange={(e) =>
            onChange(e.target.checked, dataIndex)}
        />);
        break;
      case 'button':
        break;
      default:
        childNode = (<div
          className={styles['editable-cell-value-wrap']}
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>);
    }
  }
  return <td {...restProps}>{childNode}</td>;
};

class EditTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: props.dataSource ? props.dataSource : [],
      selectedRowKeys: [],
      searchValue: undefined,
      showSearch: false,
      searchResultKeys: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource !== this.props.dataSource) {
      this.state = {
        dataSource: nextProps.dataSource ? nextProps.dataSource : [],
        searchResultKeys: this.state.searchResultKeys,
        showSearch: this.state.showSearch,
        selectedRowKeys: this.state.selectedRowKeys,
        searchValue: this.state.searchValue,
      };
    }
  }

  handleDeletes = key => {
    const dataSource = [...this.state.dataSource];
    const newDataSource = [];
    dataSource.forEach(itemData => {
      let flag = false;
      key.forEach(keyItem => {
        if (itemData.key === keyItem) {
          flag = true;
        }
      });
      if (!flag) {
        newDataSource.push(itemData);
      }
    });
    this.setState({
      dataSource: newDataSource,
    });
    this.setState({
      selectedRowKeys: [],
    });
  };

  handleDelete = record => {
    if (this.props.handleDelete) {
      this.props.handleDelete(record);
    } else {
      const { key } = record;
      const dataSource = [...this.state.dataSource];
      const newDataSource = dataSource.filter(item => item.key !== key);
      this.setState({
        dataSource: newDataSource,
      });
      if (this.props.onChange) {
        this.props.onChange(newDataSource);
      }
    }
  };

  handleAdd = () => {
    if (this.props.handleAdd) {
      this.props.handleAdd();
    } else {
      const dataSource = [...this.state.dataSource];
      const newData = {};
      const newDataSource = [...dataSource, newData];
      this.setState({
        dataSource: newDataSource,
      });

      if (this.props.onChange) {
        this.props.onChange(newDataSource);
      }
    }
  };

  handleSave = row => {
    const { rowKey } = this.props;
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row[rowKey] === item[rowKey]);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });

    this.setState({
      dataSource: newData,
    });

    if (this.props.onChange) {
      this.props.onChange(newData);
    }
  };

  onSelectChange = keys => {
    this.setState({
      selectedRowKeys: keys,
    });

    if (this.props.onSelectChange) {
      this.props.onSelectChange(keys);
    }
  };

  onSearch = (value, opt) => {
    const { dataSource = [] } = this.state;
    const { rowKey } = this.props;

    if (value === undefined || value.trim().length === 0) {
      this.setState({
        showSearch: false,
        searchResultKeys: [],
      });
      return;
    }

    const result = [];
    if (dataSource && dataSource.length > 0) {
      dataSource.forEach(item => {
        const type = typeof item[opt];
        switch (type) {
          case 'string':
            if (item[opt] && item[opt].toLowerCase().indexOf(value.toLowerCase()) !== -1) {
              result.push(item[rowKey]);
            }
            break;
          case 'number':
            if (String(item[opt]).indexOf(value) !== -1) {
              result.push(item[rowKey]);
            }
        }
      });
    }

    this.setState({
      showSearch: true,
      searchResultKeys: result,
    });

  };

  render() {
    const {
      style,
      columns = [],
      isAddRow,
      isDeleteRow,
      isSelectRows = true,
      isSelections,
      isSearch,
      rowKey,
      searchKeys = [],
      searchStyle,
    } = this.props;

    const selectBefore = [];

    searchKeys.forEach(item => {
      const searchColumn = columns.filter(column => item === column.dataIndex);
      if (searchColumn && searchColumn.length > 0) {
        selectBefore.push({
          label: searchColumn[0].title,
          value: searchColumn[0].dataIndex,
        });
      }
    });

    const { searchResultKeys = [], showSearch } = this.state;
    let dataSource = [];
    if (showSearch) {
      searchResultKeys.forEach(key => {
        dataSource.push(this.state.dataSource.filter(item => item[rowKey] === key)[0]);
      });
    } else {
      this.state.dataSource.forEach(item => {
        dataSource.push(item);
      });
    }

    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };

    const columnsData = columns.map(col => {
      if (col.type === 'button') {
        return {
          ...col,
          onCell: record => ({
            record,
            width: col.width,
            editable: col.editable === undefined ? true : col.editable,
            title: col.title,
            type: col.type,
            render: col.render,
          }),
        };
      } else {
        return {
          ...col,
          onCell: record => ({
            record,
            rowKey: rowKey,
            width: col.width,
            maxLength: col.maxLength,
            editable: col.editable === undefined ? true : col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: this.handleSave,
            type: col.type,
            data: col.data,
            defaultValue: col.defaultValue,
            ellipsis: col.ellipsis,
          }),
        };
      }
    });

    if (isDeleteRow) {
      columnsData.push({
        title: '操作',
        dataIndex: 'operation',
        width: 80,
        render: (text, record) =>
          dataSource.length > 0 ? (
            <Popconfirm title='确定要删除吗?' onConfirm={() => this.handleDelete(record)}>
              <a>删除</a>
            </Popconfirm>
          ) : null,
      });
    }

    const selectedRowKeys = this.state.selectedRowKeys;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      columnWidth: isSelections ? 65 : 50,
      preserveSelectedRowKeys: true,
      selections: isSelections ? [
          Table.SELECTION_ALL,
          Table.SELECTION_INVERT,
        ]
        : undefined,
    };

    return (
      <div style={{ ...style }} className={styles['table-wrapper']}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            {
              isAddRow && isAddRow === true ?
                <Button
                  onClick={this.handleAdd}
                  type='primary'
                  style={{
                    margin: '0px 10px 10px 0px',
                  }}
                >
                  添加
                </Button>
                : null
            }
            {
              isDeleteRow && selectedRowKeys && selectedRowKeys.length > 0 ?
                <Popconfirm title='确定删除吗?' onConfirm={() => this.handleDeletes(selectedRowKeys)}>
                  <Button
                    style={{
                      marginBottom: 10,
                    }}
                    danger
                  >
                    删除
                  </Button>
                </Popconfirm>
                : null
            }
          </div>
          <div style={{ textAlign: 'right', display: isSearch && searchKeys.length > 0 ? '' : 'none' }}>
            <SearchInput
              style={{ width: '400px', marginBottom: '10px', ...searchStyle }}
              addonBefore={selectBefore}
              placeholder='关键字搜索'
              onSearch={this.onSearch}
            />
          </div>
        </div>
        <Table
          rowSelection={isSelectRows ? rowSelection : null}
          rowKey={rowKey}
          components={components}
          rowClassName={() => styles['editable-row']}
          bordered
          dataSource={dataSource}
          columns={columnsData}
          style={{ width: '100%' }}
          size={this.props.size || 'middle'}
          pagination={this.props.pagination === false ? false
            : (this.props.pagination || {
              size: 'middle',
              hideOnSinglePage: true,
              showSizeChanger: false,
            })}
          scroll={this.props.scroll}
        />
      </div>
    );
  }

}

export default EditTable;
