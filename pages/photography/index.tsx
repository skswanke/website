import Head from "next/head";
import styled from "styled-components";
import { ExifData } from "exif";
import { Article, H1, Main } from "../../components";
import Header from "../../components/header";
import { getPhotos } from "../../lib/api";
import Image from "next/image";

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
const ImgContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 66.66666%;
  overflow: hidden;
  :hover {
    ${ExifText} {
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
  allPhotos: { slug: string; exif: ExifData }[];
}

export default function Photography({ allPhotos }: Props) {
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
        <div>
          <Article>
            <H1>Photos n&rsquo; Stuff</H1>
          </Article>
          <Grid>
            {allPhotos.map((photo) => (
              <A key={photo.slug} href={`/images/photographs/${photo.slug}`}>
                <ImgContainer>
                  <ImgPosition>
                    <Img
                      src={`/images/photographs/${photo.slug}`}
                      height={photo.exif.exif.ExifImageHeight || 500}
                      width={photo.exif.exif.ExifImageWidth || 500}
                    />
                  </ImgPosition>
                  {photo.exif.exif.CreateDate && (
                    <ExifText>
                      1/{1 / (photo.exif.exif.ExposureTime || 1)}s | f
                      {photo.exif.exif.ApertureValue} |{" "}
                      {photo.exif.exif.FocalLength}mm | {photo.exif.exif.ISO}{" "}
                      ISO | {photo.exif.exif.LensModel}
                    </ExifText>
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
