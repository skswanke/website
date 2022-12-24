import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { getExifPromise } from "./exif";

const photosDirectory = join(process.cwd(), "public/images/photographs");

export async function getPhotos() {
  const slugs = fs.readdirSync(photosDirectory);
  const photos = await Promise.all(
    slugs.map(async (slug) => {
      const path = join(photosDirectory, slug);
      const exif = await getExifPromise(path).catch(() => ({
        exif: { CreateDate: null },
      }));
      return { slug, exif: JSON.parse(JSON.stringify(exif)) };
    })
  );
  return photos.sort((a, b) =>
    a.exif.exif.CreateDate || "" > (b.exif.exif.CreateDate || "") ? -1 : 1
  );
}

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  type Items = {
    [key: string]: string;
  };

  const items: Items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
