import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Head from "../../components/head";
import Header from "../../components/header";
import { BG, BG_DARK } from "../../lib/colors";
import World from "./world";
import { countries } from "../../_data/travel";

const Container = styled.div`
  background-color: ${BG};
  padding: 0 64px;
  @media (prefers-color-scheme: dark) {
    background-color: ${BG_DARK};
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
