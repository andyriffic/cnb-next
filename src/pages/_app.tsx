import type { AppProps } from "next/app";
import { createGlobalStyle } from "styled-components";
import { GraphqlProvider } from "../providers/GraphqlProvider";
import { PlayerNamesProvider } from "../providers/PlayerNamesProvider";
import { SocketIoProvider } from "../providers/SocketIoProvider";

const GlobalStyles = createGlobalStyle`
/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
  box-sizing: border-box;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
  font-family: "Raleway", sans-serif;
  touch-action: manipulation;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}

@font-face {
  font-family: "pixeboy";
  src: url("/fonts/Pixeboy.ttf");
}
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <GlobalStyles />
      <div>
        <GraphqlProvider>
          <SocketIoProvider>
            <PlayerNamesProvider>
              <Component {...pageProps} />
            </PlayerNamesProvider>
          </SocketIoProvider>
        </GraphqlProvider>
      </div>
    </div>
  );
}

export default MyApp;
