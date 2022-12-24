import styled from "styled-components";
import { SECONDARY_TEXT } from "../lib/colors";

const H2 = styled.h2`
  margin: 0;
`;
const H3 = styled.h3`
  margin: 0;
  color: ${SECONDARY_TEXT};
`;
const Container = styled.div`
  display: flex;
  align-items: baseline;
  grid-gap: 8px;
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
