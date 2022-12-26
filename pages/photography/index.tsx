import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import { ExifData } from "exif";
import { Article, H1, Main } from "../../components";
import Header from "../../components/header";
import { getPhotos } from "../../lib/api";
import { exifText, topText } from "../../lib/utils";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  align-items: center;
  grid-gap: 8px;

  @media only screen and (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media only screen and (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;
const Img = styled(Image)`
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
`;
const ExifText = styled.small`
  background-color: #ffffff;
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translateY(30px);
  width: 100%;
  transition: transform 200ms ease-in-out;
`;
const TopText = styled.small`
  background-color: #ffffff;
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(-30px);
  width: 100%;
  transition: transform 200ms ease-in-out;
  z-index: 1;
`;
const ImgContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 66.66666%;
  overflow: hidden;
  :hover {
    ${ExifText} {
      transform: none;
    }
    ${TopText} {
      transform: none;
    }
  }
  @media only screen and (max-width: 700px) {
    padding-bottom: 100%;
  }
`;
const ImgPosition = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;
const A = styled.a`
  width: 30vw;
  @media only screen and (max-width: 1000px) {
    width: 43vw;
  }
  @media only screen and (max-width: 700px) {
    width: 80vw;
  }
`;

interface Props {
  allPhotos: { slug: string; exif: ExifData; location: string }[];
}

export default function Photography({ allPhotos }: Props) {
  return (
    <>
      <Head>
        <title>Photography - Sam Swanke</title>
        <meta
          name="description"
          content="Sam Swanke is a software engineer at Amazon and hobby photographer, working in NYC."
        />
      </Head>

      <Header />

      <Main>
        <div>
          <Article>
            <H1>Photos n&rsquo; Stuff</H1>
          </Article>
          <Grid>
            {allPhotos.map((photo) => (
              <A key={photo.slug} href={`/images/photographs/${photo.slug}`}>
                <ImgContainer>
                  {(photo.location || photo.exif.exif.CreateDate) && (
                    <TopText>{topText(photo.exif, photo.location)}</TopText>
                  )}
                  <ImgPosition>
                    <Img
                      src={`/images/photographs/${photo.slug}`}
                      height={photo.exif.exif.ExifImageHeight || 500}
                      width={photo.exif.exif.ExifImageWidth || 500}
                    />
                  </ImgPosition>
                  {photo.exif.exif.CreateDate && (
                    <ExifText>{exifText(photo.exif)}</ExifText>
                  )}
                </ImgContainer>
              </A>
            ))}
          </Grid>
        </div>
      </Main>
    </>
  );
}

export const getStaticProps = async () => {
  const allPhotos = await getPhotos();

  return {
    props: { allPhotos },
  };
};
