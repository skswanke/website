import { ExifData } from "exif";
import { format } from "date-fns";

export const exifDateToDate = (exif: string): Date => {
  const [dateString, timeString] = exif.split(" ");
  const [yy, mm, dd] = dateString.split(":");
  const [hh, m, ss] = timeString.split(":");
  return new Date(
    parseInt(yy),
    parseInt(mm) - 1,
    parseInt(dd),
    parseInt(hh),
    parseInt(m),
    parseInt(ss)
  );
};

export const topText = (exif: ExifData, location: string): string => {
  const dateString = format(
    exifDateToDate(exif.exif.CreateDate || ""),
    "PPP"
  );
  if (location) {
    return `${dateString} | ${location}`;
  }
  return dateString;
};

export const exifText = (exif: ExifData): string => {
  return [
    exif.exif.ExposureTime && `1/${1 / (exif.exif.ExposureTime || 1)}s`,
    exif.exif.ApertureValue && `f${exif.exif.ApertureValue.toPrecision(2)}`,
    exif.exif.FocalLength && `${exif.exif.FocalLength}mm`,
    exif.exif.ISO && `ISO ${exif.exif.ISO}`,
    exif.exif.LensModel?.replace(/\(.*\)/, '').trim(),
  ]
    .filter((a) => a)
    .join(" | ");
};
