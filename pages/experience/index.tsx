import Head from "next/head";
import Header from "../../components/header";
import { Article, Main } from "../../components";
import jobs from "../../_data/experience";
import JobTitle from "../../components/job-title";
import styled from "styled-components";

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const P = styled.p`
  margin: 8px 0 24px;
`;

export default function Experience() {
  return (
    <>
      <Head>
        <title>Experience - Sam Swanke</title>
        <meta
          name="description"
          content="Sam Swanke is a software engineer at Amazon and hobby photographer, working in NYC."
        />
      </Head>

      <Header />

      <Main>
        <Article>
          {jobs.map((job) => (
            <section key={job.company + job.title}>
              <FlexContainer>
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
