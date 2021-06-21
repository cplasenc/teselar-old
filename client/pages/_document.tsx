import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <title>Teselar</title>
          {/* metatags */}
          <meta property="og:site:name" content="teselar"></meta>
          {/*<meta property="twitter:site" content="@teselar"></meta>*/}
          <meta property="twitter:card" content="summary"></meta>
          <meta property="og:type" content="website"></meta>
          <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/teselar.svg`}></meta>
          <meta property="twitter:image" content={`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/teselar.svg`}></meta>
          {/** favicon */}
          <link rel='icon' type="image/svg+xml" href="/teselar.svg"></link>
          {/* fuente */}
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link
            href='https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100;200;300;400&display=swap'
            rel='stylesheet'
          />
          {/* fontawesome */}
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossOrigin="anonymous" />
        </Head>
        <body className='bg-gray-100 font-body'>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
