import Head from "next/head";
import styled from "styled-components";
import { Article, Main, P } from "../components";
import Header from "../components/header";

const BG = styled.div`
  background-image: url(/images/photographs/dumbo-light.jpg);
  @media (prefers-color-scheme: dark) {
    background-image: url(/images/photographs/dumbo.jpg);
  }
  background-position: center;
  background-size: cover;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

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

      <BG>
        <Header />
      </BG>
    </>
  );
}
