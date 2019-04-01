import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { GlobalStyle } from '../theme';

interface IProps {
  styleTags: any;
}

export default class MyDocument extends Document<IProps> {
  public static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    );
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  public render() {
    return (
      <html>
        <Head>
          <style dangerouslySetInnerHTML={{ __html: GlobalStyle }} />
          <meta name="description" content="Рай для клипов с твича" />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <div id="root-modal" />
          <NextScript />
        </body>
      </html>
    );
  }
}
