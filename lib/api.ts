import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { ExifData } from "exif";
import { getExifPromise } from "./exif";
import { exifDateToDate } from "./utils";

const photosDirectory = join(process.cwd(), "public/images/photographs");

const getDecimalDegrees = (
  nwse: string,
  deg: number,
  min: number,
  sec: number
) => {
  const degRel = deg + min / 60 + sec / 3600;
  if (nwse === "S" || nwse === "W") {
    return -degRel;
  }
  return degRel;
};

const geocodePhoto = async (exif: ExifData): Promise<string> => {
  const { gps } = exif;
  if (!gps) {
    return "";
  }
  const { GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef } = gps;
  if (!GPSLatitude || !GPSLatitudeRef || !GPSLongitude || !GPSLongitudeRef) {
    return "";
  }
  const lat = getDecimalDegrees(
    GPSLatitudeRef,
    GPSLatitude[0],
    GPSLatitude[1],
    GPSLatitude[2]
  );
  const long = getDecimalDegrees(
    GPSLongitudeRef,
    GPSLongitude[0],
    GPSLongitude[1],
    GPSLongitude[2]
  );
  console.log({ lat, long });

  try {
    const gpsResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}`
    );

    const gpsData = await gpsResponse.json();
    console.log(gpsData);

    const address = [gpsData?.address?.city, gpsData?.address?.country];

    return address.join(", ");
  } catch (e) {
    return "";
  }
};

export async function getPhotos() {
  const slugs = fs.readdirSync(photosDirectory);
  const photos = await Promise.all(
    slugs.map(async (slug) => {
      const path = join(photosDirectory, slug);
      const exif = await getExifPromise(path).catch(() => ({
        exif: { CreateDate: null },
      }));

      if (exif.exif.CreateDate) {
        const location = await geocodePhoto(exif as ExifData);
        return { slug, exif: JSON.parse(JSON.stringify(exif)), location };
      }

      return { slug, exif: JSON.parse(JSON.stringify(exif)) };
    })
  );
  return photos.sort((a, b) => {
    if (!a || !a.exif.exif.CreateDate) {
      return 1;
    }
    if (!b || !b.exif.exif.CreateDate) {
      return -1;
    }

    const aDate = exifDateToDate(a.exif.exif.CreateDate);
    const bDate = exifDateToDate(b.exif.exif.CreateDate);

    return aDate > bDate ? -1 : 1;
  });
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
