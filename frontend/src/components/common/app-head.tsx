import Head from 'next/head';

export function AppHead(): JSX.Element {
  return (
    <Head>
      <title>SPRENS</title>
      <meta name='og:title' content='SPRENS' />
      <link rel='icon' href='/favicon.ico' />
      <link rel='manifest' href='/site.webmanifest' key='site-manifest' />
      <meta name='SPRENS:site' content='@ccrsxx' />
      <meta name='SPRENS:card' content='summary_large_image' />
    </Head>
  );
}
