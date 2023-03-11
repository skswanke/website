import styled from "styled-components";
import Link from "next/link";
import { parseISO, format } from "date-fns";

import Head from "../../components/head";
import { getAllPosts } from "../../lib/api";
import { Post } from "../../lib/types";
import Header from "../../components/header";
import { H3, Main } from "../../components";
import { SECONDARY_TEXT } from "../../lib/colors";

const UL = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  max-width: 840px;
`;
const LI = styled.li`
  :hover {
    ${H3} {
      text-decoration: underline;
    }
  }
`;
const A = styled.div`
  cursor: pointer;
`;
const TitleContainer = styled.div`
  display: flex;
  grid-gap: 8px;
  align-items: baseline;
`;
const Time = styled.time`
  color: ${SECONDARY_TEXT};
`;
export const P = styled.p`
  margin: 8px 0;
`;

interface Props {
  allPosts: Post[];
}

export default function Index({ allPosts }: Props) {
  return (
    <>
      <Head title="Blog - Sam Swanke" />
      <Header />
      <Main>
        <UL>
          {allPosts.map((post) => (
            <LI key={post.title}>
              <Link href={`posts/${post.slug}`} passHref>
                <A>
                  <TitleContainer>
                    <H3>{post.title}</H3>
                    <Time dateTime={post.date}>
                      {format(parseISO(post.date), "LLLL	d, yyyy")}
                    </Time>
                  </TitleContainer>
                  <P>{post.excerpt}</P>
                </A>
              </Link>
            </LI>
          ))}
        </UL>
      </Main>
    </>
  );
}

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
  ]);

  return {
    props: { allPosts },
  };
};
