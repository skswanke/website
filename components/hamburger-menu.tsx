import { useState } from "react";
import styled from "styled-components";
import { PRIMARY_TEXT, PRIMARY_TEXT_DARK } from "../lib/colors";
import Nav from "./nav";

const COLOR = "#000000";

const Line = styled.div`
  height: 2px;
  width: 24px;
  margin-bottom: 4px;
  background-color: ${PRIMARY_TEXT};
  @media (prefers-color-scheme: dark) {
    background-color: ${PRIMARY_TEXT_DARK};
  }
  transition: all 200ms ease-in-out;
  border-radius: 2px;
`;
const FirstLine = styled(Line)`
  ${({ isExpanded }: { isExpanded?: boolean }) =>
    isExpanded
      ? `
      transform: translate(0px, 6px) rotate(45deg);
    `
      : ""}
`;
const SecondLine = styled(Line)`
  ${({ isExpanded }: { isExpanded?: boolean }) =>
    isExpanded ? "opacity: 0;" : ""}
`;
const ThirdLine = styled(Line)`
  ${({ isExpanded }: { isExpanded?: boolean }) =>
    isExpanded
      ? `
      transform: translate(0px, -6px) rotate(-45deg);
    `
      : ""}
`;
const Container = styled.div`
  z-index: 9999;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: end;
`;

export default function HamburgerMenu() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <Container onClick={() => setIsExpanded(!isExpanded)}>
        <FirstLine isExpanded={isExpanded} />
        <SecondLine isExpanded={isExpanded} />
        <ThirdLine isExpanded={isExpanded} />
      </Container>
      {isExpanded && <Nav handleClose={() => setIsExpanded(false)} />}
    </>
  );
}
