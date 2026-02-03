import { useState } from "react";
import styled from "styled-components";
import { PRIMARY_TEXT, PRIMARY_TEXT_DARK } from "../lib/colors";
import Nav from "./nav";

const Line = styled.div`
  position: absolute;
  left: 0;
  height: 2px;
  width: 24px;
  background-color: ${PRIMARY_TEXT};
  @media (prefers-color-scheme: dark) {
    background-color: ${PRIMARY_TEXT_DARK};
  }
  transition: transform 220ms ease, opacity 220ms ease;
  transform-origin: center;
  will-change: transform, opacity;
  border-radius: 2px;
`;
const FirstLine = styled(Line)`
  top: 0;
  ${({ isExpanded }: { isExpanded?: boolean }) =>
    isExpanded
      ? `
      transform: translateY(8px) rotate(45deg);
    `
      : ""}
`;
const SecondLine = styled(Line)`
  top: 8px;
  ${({ isExpanded }: { isExpanded?: boolean }) =>
    isExpanded ? "opacity: 0; transform: scaleX(0.6);" : ""}
`;
const ThirdLine = styled(Line)`
  top: 16px;
  ${({ isExpanded }: { isExpanded?: boolean }) =>
    isExpanded
      ? `
      transform: translateY(-8px) rotate(-45deg);
    `
      : ""}
`;
const Container = styled.div`
  z-index: 9999;
  cursor: pointer;
  position: relative;
  width: 24px;
  height: 18px;
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
