import Navbar from '@/components/NavBar'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=G-3R9LM83VDP`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-3R9LM83VDP');
              `
          }}
        />
      </Head>
      <body>
        <Navbar/>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
