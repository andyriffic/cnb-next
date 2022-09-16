import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <div>
        <h2>Hey</h2>
      </div>
      <div>
        <Component {...pageProps} />
      </div>
    </div>
  );
}
export default MyApp;
