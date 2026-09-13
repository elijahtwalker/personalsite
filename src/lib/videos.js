// The clips shown on /views.
//
// This is the only file that needs editing when videos change. Poster images, playback URLs and
// titles are all derived from the Cloudinary URL, so nothing else in the gallery knows about
// Cloudinary at all.
//
// Entries are `[path, caption]`, where the path is everything after `/video/upload/`. Pasting a full
// delivery URL into VIDEO_SOURCES works too — the parser accepts either.

import { parseCloudinaryVideoUrl, posterUrl, largePosterUrl, videoUrl, titleFromPublicId } from './cloudinary';

const BASE = 'https://res.cloudinary.com/awx0mxmf/video/upload';

const CLIPS = [
  ['v1789267536/IMG_9571.mov', 'dallas, 2026'],
  ['v1789267536/IMG_9859.mov', 'nyc, 2025'],
  ['v1789267535/IMG_8794.mov', 'lisbon, 2026'],
  ['v1789267535/IMG_9006.mov', 'madrid, 2026'],
  ['v1789267534/IMG_8758.mov', 'lisbon, 2026'],
  ['v1789267534/IMG_8785.mov', 'lisbon, 2026'],
  ['v1789267534/IMG_8755.mov', 'lisbon, 2026'],
  ['v1789267533/IMG_8547.mov', 'the azores, 2026'],
  ['v1789267533/IMG_8733.mov', 'lisbon, 2026'],
  ['v1789267532/IMG_8653.mov', 'lisbon, 2026'],
  ['v1789267532/IMG_8521.mov', 'the azores, 2026'],
  ['v1789267532/IMG_8568.mov', 'the azores, 2026'],
  ['v1789267532/IMG_8674.mov', 'lisbon, 2026'],
  ['v1789267530/IMG_8462.mov', 'the azores, 2026'],
  ['v1789267530/IMG_8507.mov', 'the azores, 2026'],
  ['v1789267530/IMG_8450.mov', 'the azores, 2026'],
  ['v1789267529/IMG_8356.mov', 'the azores, 2026'],
  ['v1789267528/IMG_7981.mov', 'the azores, 2026'],
  ['v1789267528/IMG_8328.mov', 'the azores, 2026'],
  ['v1789267528/IMG_8201.mov', 'the azores, 2026'],
  ['v1789267527/IMG_7833.mov', 'the azores, 2026'],
  ['v1789267527/IMG_8041.mov', 'the azores, 2026'],
  ['v1789267527/IMG_7848.mov', 'the azores, 2026'],
  ['v1789267526/IMG_7760.mov', 'the azores, 2026'],
  ['v1789267525/IMG_7643.mov', 'madrid, 2026'],
  ['v1789267525/IMG_7616.mov', 'madrid, 2026'],
  ['v1789267525/IMG_7653.mov', 'malaga, 2026'],
  ['v1789267524/IMG_7591.mov', 'madrid, 2026'],
  ['v1789267524/IMG_7573.mov', 'madrid, 2026'],
  ['v1789267523/IMG_7516.mov', 'malaga, 2026'],
  ['v1789267523/IMG_7522.mov', 'malaga, 2026'],
  ['v1789267523/IMG_7410.mov', 'seville, 2026'],
  ['v1789267522/IMG_7409.mov', 'seville, 2026'],
  ['v1789267522/IMG_7363.mov', 'seville, 2026'],
  ['v1789267522/IMG_7372.mov', 'seville, 2026'],
  ['v1789267521/IMG_7327.mov', 'seville, 2026'],
  ['v1789267521/IMG_7338.mov', 'seville, 2026'],
  ['v1789267521/IMG_7322.mov', 'seville, 2026'],
  ['v1789267520/IMG_7319.mov', 'seville, 2026'],
  ['v1789267520/IMG_7303.mov', 'seville, 2026'],
  ['v1789267520/IMG_7313.mov', 'seville, 2026'],
  ['v1789267519/IMG_7254.mov', 'seville, 2026'],
  ['v1789267519/IMG_7281.mov', 'seville, 2026'],
  ['v1789267519/IMG_7277.mov', 'seville, 2026'],
  ['v1789267518/IMG_7275.mov', 'seville, 2026'],
  ['v1789267518/IMG_7261.mov', 'seville, 2026'],
  ['v1789267518/IMG_7274.mov', 'seville, 2026'],
  ['v1789267517/IMG_7157.mov', 'malaga, 2026'],
  ['v1789267517/IMG_7204.mov', 'malaga, 2026'],
  ['v1789267516/IMG_7125.mov', 'malaga, 2026'],
  ['v1789267516/IMG_7108.mov', 'malaga, 2026'],
  ['v1789267516/IMG_7107.mov', 'malaga, 2026'],
  ['v1789267516/IMG_7127.mov', 'malaga, 2026'],
  ['v1789267515/IMG_7092.mov', 'malaga, 2026'],
  ['v1789267515/IMG_7097.mov', 'malaga, 2026'],
  ['v1789267514/IMG_7016.mov', 'malaga, 2026'],
  ['v1789267514/IMG_7035.mov', 'malaga, 2026'],
  ['v1789267514/IMG_7040.mov', 'malaga, 2026'],
  ['v1789267514/IMG_7057.mov', 'malaga, 2026'],
  ['v1789267513/IMG_6977.mov', 'malaga, 2026'],
  ['v1789267513/IMG_6897.mov', 'malaga, 2026'],
  ['v1789267513/IMG_6975.mov', 'malaga, 2026'],
  ['v1789267512/IMG_6801.mov', 'malaga, 2026'],
  ['v1789267512/IMG_6791.mov', 'malaga, 2026'],
  ['v1789267511/IMG_6736.mov', 'madrid, 2026'],
  ['v1789267511/IMG_6790.mov', 'malaga, 2026'],
  ['v1789267511/IMG_6730.mov', 'madrid, 2026'],
  ['v1789267511/IMG_6722.mov', 'madrid, 2026'],
  ['v1789267510/IMG_6620.mov', 'madrid, 2026'],
  ['v1789267510/IMG_6723.mov', 'madrid, 2026'],
  ['v1789267509/IMG_5222.mov', 'eastsound, 2025'],
  ['v1789267509/IMG_5259.mov', 'eastsound, 2025'],
  ['v1789267509/IMG_5308.mov', 'eastsound, 2026'],
  ['v1789267508/IMG_5157.mov', 'eastsound, 2025'],
  ['v1789267508/IMG_4039.mov', 'dallas, 2025'],
  ['v1789267507/IMG_3606.mov', 'dallas, 2025'],
  ['v1789267507/IMG_3926.mov', 'fort worth, 2025'],
  ['v1789267507/IMG_3356.mov', 'nyc, 2025'],
  ['v1789267507/IMG_4005.mov', 'dallas, 2025'],
  ['v1789267506/IMG_3908.mov', 'fort worth, 2025'],
  ['v1789267506/IMG_3354.mov', 'nyc, 2025'],
  ['v1789267505/IMG_2815.mov', 'seattle, 2026'],
  ['v1789267505/IMG_3282.mov', 'nyc, 2025'],
  ['v1789267505/IMG_3320.mov', 'nyc, 2025'],
  ['v1789267505/IMG_3305.mov', 'nyc, 2025'],
  ['v1789267505/IMG_3325.mov', 'nyc, 2025'],
  ['v1789267503/IMG_2664.mov', 'vancouver, 2026'],
  ['v1789267503/IMG_2807.mov', 'seattle, 2026'],
  ['v1789267503/IMG_2350.mov', 'seattle, 2026'],
  ['v1789267503/IMG_2676.mov', 'vancouver, 2026'],
  ['v1789267503/IMG_2792.mov', 'seattle, 2026'],
  ['v1789267502/IMG_2548.mov', 'seattle, 2026'],
  ['v1789267501/IMG_2530.mov', 'seattle, 2026'],
  ['v1789267501/IMG_2476.mov', 'seattle, 2026'],
  ['v1789267501/IMG_2489.mov', 'seattle, 2026'],
  ['v1789267501/IMG_2464.mov', 'seattle, 2026'],
  ['v1789267500/IMG_2200.mov', 'seattle, 2026'],
  ['v1789267499/IMG_2037.mov', 'san fransisco, 2026'],
  ['v1789267499/IMG_2088.mov', 'san fransisco, 2026'],
  ['v1789267499/IMG_2065.mov', 'san fransisco, 2026'],
  ['v1789267498/IMG_1830.mov', 'seattle, 2026'],
  ['v1789267498/IMG_1536.mov', 'olympic, 2026'],
  ['v1789267498/IMG_1490.mov', 'olympic, 2026'],
  ['v1789267497/IMG_1478.mov', 'olympic, 2026'],
  ['v1789267497/IMG_1257.mov', 'olympic, 2026'],
  ['v1789267496/IMG_1436.mov', 'olympic, 2026'],
  ['v1789267496/IMG_1213.mov', 'olympic, 2026'],
  ['v1789267495/IMG_1204.mov', 'olympic, 2026'],
  ['v1789267494/IMG_1184.mov', 'olympic, 2026'],
  ['v1789267494/IMG_1192.mov', 'olympic, 2026'],
  ['v1789267493/IMG_0990.mov', 'olympic, 2026'],
  ['v1789267493/IMG_1056.mov', 'olympic, 2026'],
  ['v1789267493/IMG_1165.mov', 'olympic, 2026'],
  ['v1789267492/IMG_0753.mov', 'olympic, 2026'],
  ['v1789267492/IMG_0984.mov', 'seattle, 2026'],
  ['v1789267492/IMG_0746.mov', 'olympic, 2026'],
  ['v1789267491/IMG_0616.mov', 'seattle, 2026'],
  ['v1789267491/IMG_0655.mov', 'seattle, 2026'],
  ['v1789267491/IMG_0167.mov', 'seattle, 2026'],
  ['v1789267490/IMG_0165.mov', 'seattle, 2026'],
  ['v1789267490/IMG_0422.mov', 'seattle, 2026'],
  ['v1789267490/IMG_0486.mov', 'seattle, 2026'],
];

export const VIDEO_SOURCES = CLIPS.map(([path, title]) => ({ url: `${BASE}/${path}`, title }));

// Turns the list above into the shape the gallery consumes. Anything that isn't a recognisable
// Cloudinary video URL is skipped rather than rendered as a broken tile.
export function createVideoItems(sources = VIDEO_SOURCES) {
  return sources
    .map((source, index) => {
      const url = typeof source === 'string' ? source : source?.url;
      const asset = parseCloudinaryVideoUrl(url);
      if (!asset) return null;

      return {
        id: `${asset.publicId}-${index}`,
        title: (typeof source === 'object' && source?.title) || titleFromPublicId(asset.publicId),
        // A URL here rather than a canvas; the gallery handles both.
        poster: posterUrl(asset),
        largePoster: largePosterUrl(asset),
        video: videoUrl(asset),
        placeholder: false,
      };
    })
    .filter(Boolean);
}
