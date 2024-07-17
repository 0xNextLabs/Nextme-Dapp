import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Script from 'next/script'
import MobileContent from '@/components/card-group/chains-card/mobile-content'
import { GlobalContextProvider } from '@/components/context'
import { Analytics } from '@vercel/analytics/react'
import NmMetaHead from '@/components/nm-meta-head'
import NmModal from '@/components/nm-modal/Modal'
import NmCrop from '@/components/nm-crop'
import { env } from '@/lib/types/env'
import * as gtag from '@/lib/gtag'

import config from '@/config'

import 'animate.css'
import 'swiper/css'
import 'swiper/css/scrollbar'
import 'rc-dialog/assets/index.css'
import '@/styles/index.scss'

const { title, mission } = config

export default function App({ Component, pageProps }) {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = url => gtag.pageview(url)
    router.events.on('routeChangeComplete', handleRouteChange)
    router.events.on('hashChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
      router.events.off('hashChangeComplete', handleRouteChange)
    }
  }, [router.events])
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="robots" content="index,follow" />
        <meta property="description" content={mission} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content={title} />
        <meta property="og:image:type" content="image/jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={mission} />
        <meta property="fb:app_id" content="3352708271717403" />
      </Head>
      <NmMetaHead userInfo={pageProps} authUrl={pageProps?.authUrl || ''} />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3772FF" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Courgette&family=Poppins&family=Righteous&family=Satisfy&family=Chillax&family=Lato&family=Fira+Sans&display=swap"
      />
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script strategy="afterInteractive" src={`https://googletagmanager.com/gtag/js?id=${env.gaId}`} />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${env.gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Script
        id="iframely-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function loadIframelyEmbedJs() {
              // Replace 'iframe.ly' with your custom CDN if available.
              if (document.querySelectorAll("[data-iframely-url]").length === 0
                  && document.querySelectorAll("iframe[src*='iframe.ly']").length === 0) return;
              var iframely = window.iframely = window.iframely || {};
              if (iframely.load) {
                  iframely.load();
              } else {
                  var ifs = document.createElement('script'); ifs.type = 'text/javascript'; ifs.async = true;
                  ifs.src = ('https:' == document.location.protocol ? 'https:' : 'http:') + '//cdn.iframe.ly/embed.js';
                  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ifs, s);
              }
            }
            // Run after DOM ready.
            loadIframelyEmbedJs();
          `,
        }}
      />
      <GlobalContextProvider>
        <Component {...pageProps} />
        <Analytics />
        <NmCrop />
        <NmModal />
        <MobileContent />
      </GlobalContextProvider>
    </>
  )
}
