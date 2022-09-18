import type { AppProps } from "next/app";
import { GraphqlProvider } from "../providers/GraphqlProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
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
