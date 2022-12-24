import Head from "next/head";
import { Article, Main } from "../components";
import Header from "../components/header";

export default function Home() {
  return (
    <>
      <Head>
        <title>Sam Swanke - Software Engineer</title>
        <meta
          name="description"
          content="Sam Swanke is a software engineer at Amazon and hobby photographer, working in NYC."
        />
        <link rel="icon" href="/icon.png" />
      </Head>

      <Header />
      <Main>
        <Article>
            <h2>Developer at large</h2>
        </Article>
      </Main>
    </>
  );
}
