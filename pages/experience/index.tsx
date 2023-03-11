import styled from "styled-components";

import Head from "../../components/head";
import Header from "../../components/header";
import { Article, Main } from "../../components";
import jobs from "../../_data/experience";
import JobTitle from "../../components/job-title";
import useIsMobile, { MOBILE_CUTOFF } from "../../lib/use-is-mobile";

const FlexContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  @media screen and (max-width: ${MOBILE_CUTOFF}px) {
    flex-direction: column;
  }
`;

const P = styled.p`
  margin: 8px 0 24px;
`;

export default function Experience() {
  const isMobile = useIsMobile();

  return (
    <>
      <Head title="Experience - Sam Swanke" />
      <Header />

      <Main>
        <Article>
          {jobs.map((job) => (
            <section key={job.company + job.title}>
              <FlexContainer isMobile={isMobile}>
                <JobTitle company={job.company} title={job.title} />
                <small>
                  {job.dates} | {job.location}
                </small>
              </FlexContainer>
              <P>{job.text || job.description}</P>
            </section>
          ))}
        </Article>
      </Main>
    </>
  );
}
