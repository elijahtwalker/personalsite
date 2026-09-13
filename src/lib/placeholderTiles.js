// Stand-in tiles for the /views gallery until the Cloudinary uploads are ready.
//
// These are shaped exactly like the real thing will be — an id, a title, a poster and a video source —
// so swapping in the real list means replacing this module's output with the Cloudinary data and
// changing nothing else. `poster` is a canvas the gallery turns into a texture; for real items it will
// be a URL instead, which is why the gallery treats it as an opaque source.

// The site's reds, light through dark.
const RED_FAMILY = [
  '#d2695c',
  '#b24137',
  '#a3413a',
  '#932f2a',
  '#8d3129',
  '#7b2d26',
  '#6a1f2a',
  '#5c1a1b',
  '#4b1b17',
  '#3a0f12',
];

const PLACEHOLDER_TITLES = [
  'kickoff opener',
  'campus reel',
  'title sequence',
  'colour study',
  'hack night',
  'b-roll pass',
  'interview cut',
  'motion test',
  'end card',
  'transition study',
  'drone pass',
  'time lapse',
];

function rand(seed) {
  const x = Math.sin(seed * 91.7 + 47.3) * 28461.13;
  return x - Math.floor(x);
}

// A 16:9 frame: flat red field, a slightly darker band along the bottom so the tiles have a visible
// "up", and the index so individual tiles can be told apart while the shapes are being tuned.
function drawPlaceholder(index, width = 384) {
  const height = Math.round((width * 9) / 16);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const base = RED_FAMILY[index % RED_FAMILY.length];
  const tone = rand(index);

  const wash = ctx.createLinearGradient(0, 0, width, height);
  wash.addColorStop(0, base);
  wash.addColorStop(1, RED_FAMILY[(index + 3 + Math.floor(tone * 3)) % RED_FAMILY.length]);
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);

  // Off-centre highlight, so a wall of tiles doesn't look like flat swatches.
  const glow = ctx.createRadialGradient(
    width * (0.24 + tone * 0.3),
    height * 0.26,
    0,
    width * 0.5,
    height * 0.5,
    width * 0.75,
  );
  glow.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
  glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(26, 6, 6, 0.28)';
  ctx.fillRect(0, height - height * 0.16, width, height * 0.16);

  ctx.fillStyle = 'rgba(251, 254, 249, 0.82)';
  ctx.font = `500 ${Math.round(height * 0.13)}px "EB Garamond", Georgia, serif`;
  ctx.textBaseline = 'middle';
  ctx.fillText(String(index + 1).padStart(3, '0'), width * 0.05, height * 0.915);

  return canvas;
}

export function createPlaceholderItems(count = 120) {
  return Array.from({ length: count }, (_, index) => ({
    id: `placeholder-${index}`,
    title: `${PLACEHOLDER_TITLES[index % PLACEHOLDER_TITLES.length]} ${String(index + 1).padStart(3, '0')}`,
    // Real items will carry URLs here; the gallery only cares that it can hand this to a texture.
    poster: drawPlaceholder(index),
    video: null,
    placeholder: true,
  }));
}
