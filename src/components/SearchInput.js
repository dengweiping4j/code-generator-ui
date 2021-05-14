import React, { Component } from 'react';
import { Input, Select } from 'antd';
const { Option } = Select;

class SearchInput extends Component {

  constructor(props) {
    super(props);

    let defaultValue;
    if (props.addonBefore) {
      this.options = this.props.addonBefore.map((item, index) => {
        if (index === 0) defaultValue = item.value;
        return <Option key={item.value} value={item.value}>{item.label}</Option>
      });
    }
    this.state = {
      opt: defaultValue || '',
      value: props.value || '',
    }
  }

  onSelectedChanged = (value) => {
    this.setState({
      opt: value,
    })
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })

  }

  onSearch = (value) => {
    this.props.onSearch && this.props.onSearch(value, this.state.opt);
  }

  render() {
    if (this.props.addonBefore) {
      return (
        <Input.Search
          style={this.props.style}
          addonBefore={<Select style={this.props.addonBeforeStyle || { minWidth: 120 }} defaultValue={this.state.opt} onChange={this.onSelectedChanged}>{this.options}</Select>}
          placeholder={this.props.placeholder || "输入搜索文本，搜索..."}
          size={this.props.size || 'default'}
          onChange={this.onChange}
          onSearch={this.onSearch}
          value={this.state.value}
        />
      );
    }

    return (
      <Input.Search
        style={this.props.style}
        placeholder={this.props.placeholder || "输入搜索文本，搜索..."}
        size={this.props.size || 'default'}
        onChange={this.onChange}
        onSearch={this.onSearch}
        value={this.state.value}
      />
    );
  }
}

export default SearchInput;
