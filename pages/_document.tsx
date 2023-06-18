import { Html, Head, Main, NextScript } from "next/document";
import { ErrorBoundary } from "react-error-boundary";

function fallbackRender({ error, resetErrorBoundary }: { error: any, resetErrorBoundary: any }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="flex justify-center">
        <div className="content-container">
          <ErrorBoundary fallbackRender={fallbackRender}>
            <Main />
          </ErrorBoundary>
        </div>
        <NextScript />
      </body>
    </Html>
  );
}
