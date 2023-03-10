import Head from "next/head";
import Header from "../../components/header";
import { Article, Main } from "../../components";
import projects from "../../_data/open-source";
import styled from "styled-components";
import { HOVER_BG, HOVER_BG_DARK } from "../../lib/colors";

const Img = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  padding-right: 16px;
`;
const UL = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-gap: 8px;
`;
const LI = styled.li``;
const A = styled.a`
  display: flex;
  align-items: center;
  border-radius: 4px;
  :hover {
    background-color: ${HOVER_BG};
  }
  @media (prefers-color-scheme: dark) {
    :hover {
      background-color: ${HOVER_BG_DARK};
    }
  }
  padding: 0 16px;
`;

export default function Experience() {
  return (
    <>
      <Head>
        <title>Open Source - Sam Swanke</title>
        <meta
          name="description"
          content="Sam Swanke is a software engineer at Amazon and hobby photographer, working in NYC."
        />
      </Head>

      <Header />

      <Main>
        <Article>
          <UL>
            {projects.map((project) => (
              <LI key={project.title}>
                <A href={project.link} target="#">
                  <Img
                    src={`/images/logos/${project.src}`}
                    width={50}
                    height={50}
                    alt={project.title}
                  />
                  {project.title}
                </A>
              </LI>
            ))}
          </UL>
        </Article>
      </Main>
    </>
  );
}
