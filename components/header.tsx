import Link from "next/link";
import React, { useEffect } from "react";
import styled from "styled-components";
import Github from "../icons/github";
import { HOVER_BG, HOVER_BG_DARK } from "../lib/colors";
import useIsMobile, { MOBILE_CUTOFF } from "../lib/use-is-mobile";
import HamburgerMenu from "./hamburger-menu";

const HeaderContainer = styled.header<{ isMobile: boolean }>`
  display: flex;
  align-items: baseline;
  padding: 32px 64px;
  grid-gap: 16px;
  @media screen and (max-width: ${MOBILE_CUTOFF}px) {
    justify-content: space-between;
    align-items: center;
    padding: 16px 32px;
  }
`;

const Nav = styled.nav`
  display: flex;
`;
const NavItem = styled.a`
  padding: 8px 8px;
  border-radius: 4px;
  margin: 0;
  :hover {
    background-color: ${HOVER_BG};
  }
  @media (prefers-color-scheme: dark) {
    :hover {
      background-color: ${HOVER_BG_DARK};
    }
  }
`;
const A = styled.a`
  display: flex;
  margin: 8px;
  align-items: baseline;
`;

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <HeaderContainer isMobile={isMobile}>
      <h1>
        <Link href="/">Sam Swanke</Link>
      </h1>
      {isMobile ? (
        <HamburgerMenu />
      ) : (
        <Nav>
          <Link href="/experience" passHref>
            <NavItem>Experience</NavItem>
          </Link>
          <Link href="/open-source" passHref>
            <NavItem>Open Source</NavItem>
          </Link>
          <Link href="/photography" passHref>
            <NavItem>Photography</NavItem>
          </Link>
          <Link href="/blog" passHref>
            <NavItem>Blog</NavItem>
          </Link>
          <NavItem
            href="https://raw.githubusercontent.com/skswanke/resume/master/resume.pdf"
            target="blank"
          >
            Resume
          </NavItem>
          <A href="https://github.com/skswanke" target="#">
            <Github />
          </A>
        </Nav>
      )}
    </HeaderContainer>
  );
};

export default Header;
