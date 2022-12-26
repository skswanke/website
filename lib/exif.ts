import ExifImage from "exif";
import { promisify } from "util";

export const getExifPromise = promisify(ExifImage);
