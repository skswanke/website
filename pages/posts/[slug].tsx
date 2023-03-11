import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { getPostBySlug, getAllPosts } from "../../lib/api";
import Head from "next/head";
import markdownToHtml from "../../lib/markdown-to-html";
import Header from "../../components/header";
import { Article, H1, Main } from "../../components";
import { parseISO, format } from "date-fns";
import { Post as IPost } from "../../lib/types";
import styled from "styled-components";

const MDContainer = styled.div`
  & h1 {
    font-size: 32px;
  }
  & h2 {
    font-size: 24px;
  }
  & h3 {
    font-size: 20px;
  }
  & img {
    max-width: 600px;
    max-height: 500px;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 100%;
  }
`;

type Props = {
  post: IPost;
};

export default function Post({ post }: Props) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <>
      <Head>
        <title>{post.title} | Sam Swanke Blog</title>
      </Head>
      <Header />

      <Main>
        {router.isFallback ? (
          <p>Loading…</p>
        ) : (
          <>
            <Article className="mb-32">
              <H1>{post.title}</H1>
              <time dateTime={post.date}>
                {format(parseISO(post.date), "LLLL	d, yyyy")}
              </time>
              <MDContainer dangerouslySetInnerHTML={{ __html: post.content }} />
            </Article>
          </>
        )}
      </Main>
    </>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, ["title", "date", "slug", "content"]);
  const content = await markdownToHtml(post.content || "");

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
