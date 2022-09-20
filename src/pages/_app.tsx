import type { AppProps } from "next/app";
import Head from "next/head";
import { GraphqlProvider } from "../providers/GraphqlProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div>
        <h2>Hey</h2>
      </div>
      <div>
        <GraphqlProvider>
          <Component {...pageProps} />
        </GraphqlProvider>
      </div>
    </div>
  );
}
export default MyApp;
