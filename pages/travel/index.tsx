import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Head from "../../components/head";
import Header from "../../components/header";
import { BG, BG_DARK } from "../../lib/colors";
import World from "./world";
import { countries } from "../../_data/travel";
import { MOBILE_CUTOFF } from "../../lib/use-is-mobile";

const Container = styled.div`
  background-color: ${BG};
  padding: 0 64px;
  @media (prefers-color-scheme: dark) {
    background-color: ${BG_DARK};
  }
  @media screen and (max-width: ${MOBILE_CUTOFF}px) {
    padding: 0 32px;
  }
`;

const SVGContainer = styled.div`
  width: 100%;
  height: 100%;
  & svg {
    width: 100%;
    height: 100%;
    & path:hover {
      stroke: rgb(158, 104, 104);
      stroke-width: 2;
    }
    & .United.States {
      fill: rgb(125, 175, 200);
    }
    ${() =>
      countries
        .map(
          (country) =>
            `& [name="${country}"], .${country} { fill:rgb(122, 177, 105); }`
        )
        .join("\n")}

    @media (prefers-color-scheme: dark) {
      fill:rgb(114, 114, 114);
    }
  }
`;

export default function Travel() {
  return (
    <>
      <Head title="Travel Map - Sam Swanke" />
      <Header />
      <Container>
        <h1>Travel Map</h1>

        <SVGContainer>
          <World />
        </SVGContainer>
      </Container>
    </>
  );
}
