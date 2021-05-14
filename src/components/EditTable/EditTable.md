基于antd的EditTable组件，可编辑任意单元格，单元格类型可选：输入框、单选框、下拉列表、分组下拉列表

## 属性列表

参数 | 说明 | 类型 | 默认值
----|------|-----|------
style | 覆盖样式 | Object | `{}`
columns | 表格列 | Array | []
onChange | 单元格内容修改回调 | function(Object) | -
isAddRow | 是否允许新增行 | boolean | true
isDeleteRow | 是否允许删除行 | boolean | true
isSelectRows | 是否显示勾选框 | boolean | true
isSelections | 是否使用全选和反选单页勾选框 | boolean | false
isSearch | 是否需要搜索 | boolean | false
searchKeys | 搜索字段值 | Array | []
searchStyle| 搜索框样式 | Object | `{}`
dataSource | 初始化数据 | Array | `{}`
pagination | 是否分页 | boolean | true

##columns中的属性列表

参数 | 说明 | 类型 | 默认值
----|------|-----|------
title | 单元格名称 | Object | `{}`
dataIndex | 单元格属性名 | Array | []
type | 单元格类型 | input(输入框)/radio(单选框)/checkbox(复选框，对应列的值必须为boolean类型)/select(下拉列表)/groupSelect(分组下拉框)/button(按钮) | -
defaultValue | 默认值 | Object | `{}`
maxLength | 最大长度 | int | 100
data | 类型为radio/select等时需要设置选项的值 | Array | []
dataSource | 外部数据源 | [] | -
width | 列宽 | number | -
editable | 是否可编辑 | boolean | true

**使用示例：**
```javascript

class Demo extends Component {

  search = data => {
    console.log(data);
  };

  render () {
        const radioData = [{
          label: '是',
          value: '1'
        }, {
          label: '否',
          value: '2'
        }];

        const selectData = [
          {
            label: '广东省', options: [
              { label: '广州市', value: '广州' },
              { label: '佛山市', value: '佛山' },
              { label: '深圳市', value: '深圳' }
            ]
          },
          {
            label: '湖北省', options: [
              { label: '武汉市', value: '武汉' },
              { label: '恩施市', value: '恩施' }
            ]
          }
        ];

        const columnsData = [
          {
            title: '姓名',
            dataIndex: 'name',
            type: 'input'
          },
          {
            title: '年龄',
            dataIndex: 'age',
            type: 'radio',
            defaultValue: '2',
            data: radioData,
          },
          {
            title: '地址',
            dataIndex: 'address',
            type: 'groupSelect',
            data: selectData,
            defaultValue: '广州',
          }
        ];

    return (
      <div style={{ margin: '40px', width: '100%' }}>
        <EditTable columns={columnsData}/>
      </div>
    );

  }
}


export default Demo;

```
