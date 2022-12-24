import { ComponentClass, FunctionComponent } from "react";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
@font-face {
  font-family: "Fira Sans";
  src: url("/fonts/FiraSans-regular.ttf");
  font-weight: 400;
  font-display: fallback;
}

@font-face {
  font-family: "Fira Sans";
  src: url("/fonts/FiraSans-Bold.ttf");
  font-weight: 700;
  font-display: fallback;
}

html,
body {
  padding: 0;
  margin: 0;
  font-family: 'Fira Sans', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.1px;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}
`;

interface Props<T> {
  Component: ComponentClass | FunctionComponent;
  pageProps: T;
}

function MyApp<T>({ Component, pageProps }: Props<T>) {
  return (
    <>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
