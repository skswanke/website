import styled from "styled-components";
import { MOBILE_CUTOFF } from "../lib/use-is-mobile";

export const Main = styled.main`
  display: flex;
  margin: 0 32px 64px;
  padding: 0 32px;
  @media screen and (max-width: ${MOBILE_CUTOFF}px) {
    margin: 0 16px 32px;
    padding: 0 16px;
  }
`;

export const Article = styled.article`
  max-width: 840px;
  min-width: 0;
`;

export const A = styled.a`
  :hover {
    text-decoration: underline;
  }
`;

export const H1 = styled.h1`
  font-size: 32px;
  line-height: 40px;
  margin: 16px 0 8px;
`;
export const H2 = styled.h2`
  font-size: 24px;
  line-height: 32px;
`;
export const H3 = styled.h3`
  font-size: 20px;
  line-height: 32px;
  margin: 16px 0 8px;
`;
export const P = styled.p``;
