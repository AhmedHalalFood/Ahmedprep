import Script from "next/script"
import { GA_MEASUREMENT_ID } from "@/lib/analytics"

export function GoogleAnalytics() {
  return (
    <>
      {/* The inline init queues events into dataLayer immediately; the ~150 KB library
          drains that queue once it arrives, so it can wait until the page is idle. */}
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="lazyOnload" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  )
}
