import dynamic from "next/dynamic";
import React from "react";
import styled from "styled-components";
import Head from "../../components/head";
import Header from "../../components/header";
import { BG, BG_DARK } from "../../lib/colors";
import { MOBILE_CUTOFF } from "../../lib/use-is-mobile";

const TravelGlobe = dynamic(() => import("../../components/travel-globe"), {
  ssr: false,
});

const Page = styled.div`
  position: relative;
  min-height: 100vh;
  background-color: ${BG};
  overflow: hidden;

  @media (prefers-color-scheme: dark) {
    background-color: ${BG_DARK};
  }
`;

const HeaderLayer = styled.div`
  position: relative;
  z-index: 2;
`;

const Container = styled.div`
  position: relative;
  z-index: 2;
  padding: 0 64px;
  min-height: calc(100vh - 120px);
  pointer-events: none;

  @media screen and (max-width: ${MOBILE_CUTOFF}px) {
    padding: 0 32px;
  }
`;

const Legend = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

const LegendItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const LegendItemColor = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
`;

const GlobeStage = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  touch-action: none;

  canvas {
    display: block;
    height: 100%;
    width: 100%;
  }
`;

export default function Travel() {
  return (
    <>
      <Head title="Travel Map - Sam Swanke" />
      <Page>
        <GlobeStage>
          <TravelGlobe />
        </GlobeStage>
        <HeaderLayer>
          <Header />
        </HeaderLayer>
        <Container>
          <h1>Travel Map</h1>
          <Legend>
            <LegendItem>
              <LegendItemColor color="rgb(125, 175, 200)" />
              Home
            </LegendItem>
            <LegendItem>
              <LegendItemColor color="rgb(122, 177, 105)" />
              Visited
            </LegendItem>
            <LegendItem>
              <LegendItemColor color="rgb(177, 105, 105)" />
              Wish List
            </LegendItem>
          </Legend>
        </Container>
      </Page>
    </>
  );
}
