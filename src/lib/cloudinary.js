// Cloudinary URL handling for the /views gallery.
//
// Everything is derived from the plain delivery URL of each video, so the only thing that ever needs
// maintaining is the list itself. Two transformations are used and no others: reusing exactly these
// means Cloudinary builds one derivative per clip rather than a new one per variation.
//
//   poster   so_2,c_fill,ar_16:9,w_384,q_auto,f_jpg   ~15 KB, the image on every tile
//   playback c_limit,w_1280,q_auto:eco,f_auto          ~2.4 MB, only requested when a clip is opened
//
// The f_auto on playback is not optional: phone recordings arrive as HEVC, which Chrome and Firefox
// cannot play at all, so the transcode is what makes them work outside Safari.

const DELIVERY = /^https?:\/\/res\.cloudinary\.com\/([^/]+)\/video\/upload\/(.+)$/i;

// Segments like `c_limit,w_1280`, `q_auto:eco` or `so_2,c_fill,ar_16:9` that may already be in a
// pasted URL. Deliberately strict: public IDs such as `IMG_9571` look similar at a glance, so a
// segment only counts as a transformation if every comma-separated part is a known `key_value` pair
// written in lower case. Being loose here silently dropped every IMG_* clip.
const TRANSFORMATION_KEYS = new Set([
  'a', 'ar', 'b', 'bo', 'c', 'co', 'd', 'dl', 'dn', 'du', 'e', 'eo', 'f', 'fl', 'fn', 'g', 'h', 'l',
  'o', 'p', 'pg', 'q', 'r', 'so', 't', 'u', 'vc', 'w', 'x', 'y', 'z',
]);
const isTransformation = (segment) =>
  segment.includes('_') &&
  segment.split(',').every((part) => {
    const [key, ...rest] = part.split('_');
    return rest.length > 0 && TRANSFORMATION_KEYS.has(key) && key === key.toLowerCase();
  });
const VERSION = /^v\d+$/;

// Pulls the cloud name, version and public ID out of a delivery URL, ignoring any transformation
// segments that happen to be in it and the file extension on the end.
export function parseCloudinaryVideoUrl(url) {
  const match = String(url).trim().match(DELIVERY);
  if (!match) return null;

  const [, cloudName, rest] = match;
  const segments = rest.split('/').filter(Boolean);

  let version = null;
  const idParts = [];
  segments.forEach((segment) => {
    if (VERSION.test(segment)) {
      version = segment;
    } else if (!idParts.length && isTransformation(segment)) {
      // A transformation that was already applied; ours replace it.
    } else {
      idParts.push(segment);
    }
  });

  if (!idParts.length) return null;
  // Public IDs keep their folders but lose the extension.
  const publicId = idParts.join('/').replace(/\.[a-z0-9]+$/i, '');
  return { cloudName, version, publicId };
}

function deliveryUrl({ cloudName, version, publicId }, transformation, extension = '') {
  const versionPart = version ? `${version}/` : '';
  return `https://res.cloudinary.com/${cloudName}/video/upload/${transformation}/${versionPart}${publicId}${extension}`;
}

// The still on each tile. Two seconds in, because frame zero is often black.
export function posterUrl(asset, { width = 384 } = {}) {
  return deliveryUrl(asset, `so_2,c_fill,ar_16:9,w_${width},q_auto,f_jpg`, '.jpg');
}

// A larger still for the opened view, so something is on screen while the video loads.
export function largePosterUrl(asset, { width = 1280 } = {}) {
  return deliveryUrl(asset, `so_2,c_limit,w_${width},q_auto,f_jpg`, '.jpg');
}

// The clip itself. Only ever requested after someone opens it.
export function videoUrl(asset, { width = 1280 } = {}) {
  return deliveryUrl(asset, `c_limit,w_${width},q_auto:eco,f_auto`);
}

// Falls back to the public ID when no caption is given, so a missing title is readable rather than blank.
export function titleFromPublicId(publicId) {
  const last = publicId.split('/').pop() ?? publicId;
  return last.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
}
