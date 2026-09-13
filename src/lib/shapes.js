// Shape definitions for the /views gallery.
//
// Every shape is just a list of target positions, one per tile, in world units. Switching shapes
// tweens each tile from wherever it currently is to its new target, so the shapes never need to know
// about each other. Each shape also carries:
//
//   idle    — how much it drifts when left alone, so nothing ever reads as a frozen still
//   tilt    — the group's resting angle
//   fill    — how much of the viewport it should occupy. Above 1 it deliberately overflows and is
//             meant to be navigated rather than seen all at once.
//   fitMode — 'contain' fits both axes; 'width' fits the width and lets the arrangement run off the
//             bottom, which is what makes the grid a scrollable wall.
//   nav     — 'orbit' spins the arrangement under the cursor; 'pan' slides it around.

// Deterministic pseudo-random in [0, 1), so a tile lands in the same spot every time the shape is
// rebuilt and the arrangement doesn't reshuffle behind the viewer's back.
function rand(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Box-Muller, for clusters that thin out at the edges rather than stopping at a hard boundary.
function gaussian(seed) {
  const u = Math.max(rand(seed), 1e-6);
  const v = rand(seed + 0.5);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

// Columns that make a block roughly match the shape of the window, so a wide screen gets a wide
// arrangement and a narrow one gets a tall arrangement.
function columnsForAspect(count, aspect, gapX, gapY, { min = 1, max = count } = {}) {
  const columns = Math.sqrt((count * Math.max(aspect, 0.25) * gapY) / gapX);
  return Math.max(min, Math.min(max, Math.round(columns)));
}

// A wall of tiles, wider than the screen is tall so it runs past the bottom edge and is scrolled
// through. Deliberately few columns, so each tile is big enough to read.
function grid(count, { tileWidth, tileHeight, aspect = 1.6 }) {
  const gapX = tileWidth * 1.14;
  const gapY = tileHeight * 1.3;
  const columns = columnsForAspect(count, aspect, gapX, gapY, { min: 3, max: 8 });
  const rows = Math.ceil(count / columns);
  const points = [];

  for (let i = 0; i < count; i += 1) {
    const column = i % columns;
    const row = Math.floor(i / columns);
    const rowCount = row === rows - 1 ? count - row * columns : columns;
    points.push({
      x: (column - (rowCount - 1) / 2) * gapX,
      y: ((rows - 1) / 2 - row) * gapY,
      z: 0,
    });
  }
  return points;
}

// A sphere pushed hard out of shape by low-frequency noise, so it reads as a lump rather than a ball:
// bulges on one side, a flattened face on another, stretched slightly wider than it is tall.
function blob(count, { radius }) {
  const points = [];
  for (let i = 0; i < count; i += 1) {
    const t = (i + 0.5) / count;
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = GOLDEN_ANGLE * i;
    const sinI = Math.sin(inclination);
    const dir = {
      x: Math.cos(azimuth) * sinI,
      y: Math.cos(inclination),
      z: Math.sin(azimuth) * sinI,
    };
    // Several offset lobes at different frequencies: the low ones give it an overall lopsidedness,
    // the higher ones roughen the surface so it never looks machined.
    const bulge =
      1 +
      0.34 * Math.sin(dir.x * 1.6 + dir.y * 1.2 + 0.6) +
      0.24 * Math.sin(dir.y * 2.2 - dir.z * 1.8) +
      0.16 * Math.sin(dir.z * 2.9 + dir.x * 2.4) +
      0.1 * Math.sin(dir.x * 4.3 - dir.y * 3.7);
    const r = radius * bulge;
    points.push({
      x: dir.x * r * 1.18,
      y: dir.y * r * 0.94,
      z: dir.z * r,
    });
  }
  return points;
}

// A swell that runs wider than the screen, so crests roll in from one edge and out the other.
//
// Laid out facing the viewer — columns across, rows up the screen — with the swell running toward and
// away from the camera. That way it reads as a rippling wall head-on and needs no backward tilt, which
// would otherwise foreshorten the far rows into a squashed band.
function waveField(count, { tileWidth, tileHeight, radius, aspect = 1.6 }) {
  const gapX = tileWidth * 1.2;
  const gapY = tileHeight * 1.5;
  const columns = columnsForAspect(count, aspect * 1.8, gapX, gapY, { min: 6 });
  const rows = Math.ceil(count / columns);
  const points = [];

  for (let i = 0; i < count; i += 1) {
    const column = i % columns;
    const row = Math.floor(i / columns);
    const x = (column - (columns - 1) / 2) * gapX;
    const y = ((rows - 1) / 2 - row) * gapY;
    // Two crossing waves, so it undulates rather than looking like corrugation. The vertical offset
    // rides along with the depth, which is what sells it as a swell instead of a flat ripple.
    const phase = x / (radius * 0.42) + y / (radius * 0.9);
    const depth =
      Math.sin(phase) * radius * 0.46 + Math.cos(y / (radius * 0.5) - x / (radius * 1.1)) * radius * 0.22;
    points.push({ x, y: y + Math.sin(phase) * tileHeight * 0.45, z: depth });
  }
  return points;
}

// Phyllotaxis: the seed-head packing of a sunflower. The most composed of the organic shapes and the
// easiest to browse, since nothing overlaps and density is even all the way out.
function sunflower(count, { radius }) {
  const points = [];
  const scale = (radius * 1.4) / Math.sqrt(count);
  for (let i = 0; i < count; i += 1) {
    const r = scale * Math.sqrt(i + 0.5);
    const angle = GOLDEN_ANGLE * i;
    points.push({
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      // A shallow dish, so the disc catches the light at its edges instead of reading as a flat cut-out.
      z: -(r * r) / (radius * 7) + (rand(i) - 0.5) * radius * 0.05,
    });
  }
  return points;
}

// A loose flock: dense in the middle, thinning at the edges, stretched along its direction of travel
// the way a murmuration is. The idle drift does most of the work here.
function murmuration(count, { radius }) {
  const points = [];
  for (let i = 0; i < count; i += 1) {
    // A few soft centres keep it lumpy instead of one even cloud.
    const lobe = Math.floor(rand(i + 3) * 3);
    const lobeCentre = [
      { x: -radius * 0.46, y: radius * 0.14, z: 0 },
      { x: radius * 0.42, y: -radius * 0.18, z: radius * 0.12 },
      { x: radius * 0.06, y: radius * 0.34, z: -radius * 0.14 },
    ][lobe];
    points.push({
      x: lobeCentre.x + gaussian(i + 11) * radius * 0.56,
      y: lobeCentre.y + gaussian(i + 29) * radius * 0.3,
      z: lobeCentre.z + gaussian(i + 53) * radius * 0.38,
    });
  }
  return points;
}

export const SHAPES = [
  {
    id: 'grid',
    // Labels are deliberately of a similar length so the switcher doesn't change width as it steps.
    label: 'rectilinear',
    build: grid,
    idle: { amplitude: 0.04, speed: 0.12, spin: 0, swirl: 0 },
    tilt: { x: 0, y: 0 },
    fill: 1.0,
    fitMode: 'width',
    nav: 'pan',
  },
  {
    id: 'blob',
    label: 'conglomerate',
    build: blob,
    idle: { amplitude: 0.18, speed: 0.2, spin: 0.05, swirl: 0 },
    tilt: { x: 0, y: 0 },
    // Spread wider than the frame: the blob should feel like it's pressing against the edges.
    fill: 1.3,
    fitMode: 'contain',
    nav: 'orbit',
    // Tiles stay square to the viewer while the whole blob turns, so they circle rather than tumble.
    lean: false,
  },
  {
    id: 'wave',
    label: 'undulation',
    build: waveField,
    idle: { amplitude: 0.22, speed: 0.3, spin: 0, swirl: 0 },
    // Faces the viewer: the swell is built into the layout, so no tilt is needed.
    tilt: { x: 0, y: 0 },
    fill: 1.5,
    fitMode: 'contain',
    nav: 'pan',
  },
  {
    id: 'sunflower',
    label: 'phyllotaxis',
    build: sunflower,
    idle: { amplitude: 0.07, speed: 0.16, spin: 0, swirl: 0.05 },
    tilt: { x: 0, y: 0 },
    fill: 1.12,
    fitMode: 'contain',
    nav: 'orbit',
  },
  {
    id: 'murmuration',
    label: 'murmuration',
    build: murmuration,
    idle: { amplitude: 0.44, speed: 0.4, spin: 0.03, swirl: 0 },
    tilt: { x: 0, y: 0 },
    fill: 1.25,
    fitMode: 'contain',
    nav: 'orbit',
  },
];

export const DEFAULT_SHAPE = 'blob';

export function getShape(id) {
  return SHAPES.find((shape) => shape.id === id) ?? SHAPES[0];
}

// Builds one shape's target positions. `radius` sets the overall size of the arrangement; the gallery
// scales the result to the viewport afterwards, so these are relative numbers only.
export function buildShape(id, count, options) {
  return getShape(id).build(count, options);
}
