import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
// 设置高亮样式
import { tomorrow, prism, solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
// 设置高亮的语言
import { java, javascript, jsx, sql } from 'react-syntax-highlighter/dist/esm/languages/prism';

class CodeBlock extends PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    language: PropTypes.string,
  };

  static defaultProps = {
    language: null,
  };

  componentWillMount() {
    SyntaxHighlighter.registerLanguage('jsx', jsx);
    SyntaxHighlighter.registerLanguage('javascript', javascript);
    SyntaxHighlighter.registerLanguage('java', java);
    SyntaxHighlighter.registerLanguage('sql', sql);
  }

  render() {
    const { language, value } = this.props;

    /**
     * 主题
     * solarizedlight
     *tomorrow
     *prism
     *
     */

    return (
      <figure className='highlight'>
        <SyntaxHighlighter language={language} style={tomorrow}>
          {value}
        </SyntaxHighlighter>
      </figure>
    );
  }
}

export default CodeBlock;
