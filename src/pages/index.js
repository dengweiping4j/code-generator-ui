import React, { Component } from 'react';
import CodeGenerate from '@/pages/tools/code-generate';

class IndexPage extends Component {

  render() {
    return (<div style={{ width: '100%', height: '400px', textAlign: 'center', paddingTop: '200px' }}>
        <a href={'/#/tools/code-generate'} style={{fontSize:'16px'}}>跳转</a>
      </div>
    );
  }
}

export default IndexPage;
