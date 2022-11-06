import type { AppProps } from "next/app";
import Head from "next/head";
import { createGlobalStyle } from "styled-components";
import { GraphqlProvider } from "../providers/GraphqlProvider";
import { SocketIoProvider } from "../providers/SocketIoProvider";

const GlobalStyles = createGlobalStyle`
html,
body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

a {
    color: inherit;
    text-decoration: none;
}

* {
    box-sizing: border-box;
}
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <GlobalStyles />
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div>
        <GraphqlProvider>
          <SocketIoProvider>
            <Component {...pageProps} />
          </SocketIoProvider>
        </GraphqlProvider>
      </div>
    </div>
  );
}
export default MyApp;
