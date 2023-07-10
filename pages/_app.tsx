import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-470JV41HFX"
      ></Script>
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag("js", new Date());
          gtag("config", "G-470JV41HFX");
        `}
      </Script>
    </>
  );
}
