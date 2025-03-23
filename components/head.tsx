import NextHead from "next/head";
import { BG, BG_DARK } from "../lib/colors";

interface Props {
  title: string;
  description?: string;
}

export default function Head({
  title,
  description = "Sam Swanke is the Chief Technology Officer of Hello Prenup, formerly a software manager and engineer at Amazon. Also a hobby photographer, working in NYC.",
}: Props) {
  return (
    <NextHead>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="theme-color"
        content={BG}
        media="(prefers-color-scheme: light)"
      />
      <meta
        name="theme-color"
        content={BG_DARK}
        media="(prefers-color-scheme: dark)"
      />

      <link rel="icon" href="/icon.png" />
    </NextHead>
  );
}
