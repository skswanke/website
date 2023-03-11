import Link from "next/link";
import styled from "styled-components";
import Github from "../icons/github";
import { HOVER_BG, HOVER_BG_DARK } from "../lib/colors";

const Background = styled.div`
  z-index: 999;
  position: fixed;
  overflow-y: hidden;
  height: stretch;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const NavContainer = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const A = styled.a`
  display: flex;
  margin: 16px;
  align-items: baseline;
`;
const NavItem = styled.a`
  padding: 8px 8px;
  border-radius: 4px;
  margin: 0 16px;
  :hover {
    background-color: ${HOVER_BG};
  }
  @media (prefers-color-scheme: dark) {
    :hover {
      background-color: ${HOVER_BG_DARK};
    }
  }
`;

interface Props {
  handleClose: () => void;
}

export default function Nav({ handleClose }: Props) {
  return (
    <Background>
      <NavContainer>
        <Link href="/experience" passHref>
          <NavItem onClick={handleClose}>Experience</NavItem>
        </Link>
        <Link href="/open-source" passHref>
          <NavItem onClick={handleClose}>Open Source</NavItem>
        </Link>
        <Link href="/photography" passHref>
          <NavItem onClick={handleClose}>Photography</NavItem>
        </Link>
        <Link href="/blog" passHref>
          <NavItem onClick={handleClose}>Blog</NavItem>
        </Link>
        <NavItem
          onClick={handleClose}
          href="https://raw.githubusercontent.com/skswanke/resume/master/resume.pdf"
          target="blank"
        >
          Resume
        </NavItem>
        <A onClick={handleClose} href="https://github.com/skswanke" target="#">
          <Github />
        </A>
      </NavContainer>
    </Background>
  );
}
