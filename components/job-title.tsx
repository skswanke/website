import styled from "styled-components";
import { SECONDARY_TEXT, SECONDARY_TEXT_DARK } from "../lib/colors";
import { MOBILE_CUTOFF } from "../lib/use-is-mobile";

const H2 = styled.h2`
  margin: 0;
`;
const H3 = styled.h3`
  margin: 0;
  color: ${SECONDARY_TEXT};
  @media (prefers-color-scheme: dark) {
    color: ${SECONDARY_TEXT_DARK};
  }
`;
const Container = styled.div`
  display: flex;
  align-items: baseline;
  grid-gap: 8px;
  @media screen and (max-width: ${MOBILE_CUTOFF}px) {
    flex-direction: column;
  }
`;

interface JobTitleProps {
  title: string;
  company: string;
}
export default function JobTitle({ company, title }: JobTitleProps) {
  return (
    <Container>
      <H2>{company}</H2>
      <H3>{title}</H3>
    </Container>
  );
}
