import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="flex justify-center">
        <div className="content-container">
          <Main />
        </div>
        <NextScript />
      </body>
    </Html>
  );
}
