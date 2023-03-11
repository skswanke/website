import NextHead from "next/head";
import { BG, BG_DARK } from "../lib/colors";

interface Props {
  title: string;
  description?: string;
}

export default function Head({
  title,
  description = "Sam Swanke is a software engineer at Amazon and hobby photographer, working in NYC.",
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
