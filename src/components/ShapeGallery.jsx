import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { buildShape, getShape } from '../lib/shapes';

// The /views gallery: one textured plane per video, arranged into whichever shape is selected.
//
// Motion notes, since smoothness is the point of this page:
//   * Tiles are never re-laid-out. Only their transforms change, so everything stays on the GPU.
//   * Each tile runs its own critically damped spring toward its target. Springs carry velocity, so a
//     morph interrupted halfway is picked up from wherever the tile actually is rather than restarted.
//   * Morphs are staggered by how far a tile has to travel, which makes the cloud reorganise in a wave
//     instead of every tile arriving at once.
//   * Every shape keeps drifting on slow noise so the arrangement is never completely still.
//
// Sizing and navigation: shapes are built at a fixed world size, then the group is scaled to the
// viewport using the shape's own `fill` and `fitMode`. Shapes that overflow on purpose (the grid wall,
// the wave) are panned; the rest are orbited. Either way the arrangement is clamped so it can't be
// dragged off the screen entirely.

const TILE_WIDTH = 1.35;
const TILE_HEIGHT = TILE_WIDTH * (9 / 16);
const BUILD_RADIUS = 5;

// Spring stiffness and damping, tuned together: high enough to feel responsive, damped enough that
// tiles settle without visible wobble.
const STIFFNESS = 46;
const DAMPING = 13.2;
const MAX_STAGGER = 0.28; // seconds between the first and last tile starting to move
const DRAG_THRESHOLD = 5; // px of movement before a click counts as a drag instead
// How far the arrangement may be turned by dragging, in radians.
const MAX_ORBIT_X = 0.42;
const MAX_ORBIT_Y = 0.65;

// Cheap deterministic noise. Enough for drift; not worth pulling in a simplex library.
function drift(seed, t) {
  return (
    Math.sin(t * 0.9 + seed * 12.9898) * 0.6 +
    Math.sin(t * 1.37 + seed * 78.233) * 0.3 +
    Math.sin(t * 2.1 + seed * 37.719) * 0.1
  );
}

// Shortest way back to zero, so damping a rotation of 7 radians doesn't unwind seven times.
function wrapAngle(angle) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Which clip takes which position in a shape. Reshuffled whenever the shape changes, so the
// arrangement is different every visit and every switch rather than the same clip always sitting in
// the same spot.
function shuffledOrder(count) {
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

// Scratch values for the per-frame billboard maths, so the loop doesn't allocate.
const groupQuaternion = new THREE.Quaternion();
const billboardQuaternion = new THREE.Quaternion();

export default function ShapeGallery({
  items,
  shapeId,
  onHoverChange,
  onSelect,
  reducedMotion = false,
}) {
  const mountRef = useRef(null);
  // Everything the animation loop touches lives here, so React re-renders never restart the scene.
  const sceneRef = useRef(null);
  const callbacksRef = useRef({ onHoverChange, onSelect });

  callbacksRef.current = { onHoverChange, onSelect };

  // Scene setup. Runs once for the life of the page: tiles are created here and only ever retargeted.
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // One group holds every tile, so a shape's tilt, spin, pan, zoom and fit are a single transform.
    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.PlaneGeometry(TILE_WIDTH, TILE_HEIGHT);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    // Posters arrive either as a canvas (the placeholder tiles) or as a Cloudinary URL (real clips).
    // URLs load in the background, so tiles show a solid tone from the site's palette until the image
    // lands rather than flashing black.
    function loadPoster(poster, material) {
      if (typeof poster !== 'string') {
        const canvasTexture = new THREE.Texture(poster);
        canvasTexture.needsUpdate = true;
        canvasTexture.minFilter = THREE.LinearFilter;
        canvasTexture.generateMipmaps = false;
        return canvasTexture;
      }

      const pending = new THREE.Texture();
      textureLoader.load(poster, (loaded) => {
        loaded.minFilter = THREE.LinearFilter;
        loaded.generateMipmaps = false;
        material.map = loaded;
        material.color.setHex(0xffffff);
        material.needsUpdate = true;
        pending.dispose();
      });
      return pending;
    }

    const tiles = items.map((item, index) => {
      // Double-sided so a tile is never invisible when the arrangement is turned away from the viewer.
      const material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        // Tinted while a poster is still downloading; cleared to white once the image is in.
        color: typeof item.poster === 'string' ? 0x7b2d26 : 0xffffff,
      });
      const texture = loadPoster(item.poster, material);
      material.map = texture;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData.index = index;
      group.add(mesh);

      return {
        mesh,
        texture,
        index,
        seed: index * 0.618,
        pos: new THREE.Vector3(0, 0, 0),
        vel: new THREE.Vector3(0, 0, 0),
        target: new THREE.Vector3(0, 0, 0),
        distance: 0,
        delay: 0,
        scale: 0.001,
        scaleTarget: 1,
      };
    });

    const state = {
      renderer,
      scene,
      camera,
      group,
      geometry,
      tiles,
      shape: getShape(shapeId),
      aspect: 1.6,
      fit: 1,
      fitTarget: 1,
      // Display scale shared by every shape, derived from the grid layout.
      baseFit: 1,
      // Maps each tile to a position in the current shape; reshuffled on every shape change.
      order: null,
      // How far the arrangement may be pushed before it would leave the screen.
      panLimit: { x: 0, y: 0 },
      // Viewer navigation, applied on top of the shape's own motion.
      nav: { panX: 0, panY: 0, velX: 0, velY: 0, rotX: 0, rotY: 0, velRotX: 0, velRotY: 0, zoom: 1 },
      spinY: 0,
      spinZ: 0,
      elapsed: 0,
      morphClock: Infinity,
      hovered: -1,
      pointer: new THREE.Vector2(-10, -10),
      pointerActive: false,
      dragging: false,
      dragMoved: 0,
      lastPointer: { x: 0, y: 0 },
      raycaster: new THREE.Raycaster(),
      reducedMotion,
      running: true,
    };
    sceneRef.current = state;

    tiles.forEach((tile) => {
      tile.mesh.position.copy(tile.pos);
      tile.mesh.scale.setScalar(0.001);
    });

    // How much of the world is visible at a given depth, used to scale shapes to fit.
    function viewExtents(depth = 0) {
      const distance = Math.max(camera.position.z - depth, 1);
      const halfHeight = Math.tan((camera.fov * Math.PI) / 360) * distance;
      return { halfHeight, halfWidth: halfHeight * camera.aspect };
    }

    // The scale every shape is drawn at, taken from the grid layout so a tile is exactly as big in the
    // blob or the wave as it is in the grid. Shapes then size themselves by spreading their points
    // wider or tighter, rather than by being scaled up and down.
    function gridScale() {
      const gridPoints = buildShape('grid', tiles.length, {
        tileWidth: TILE_WIDTH,
        tileHeight: TILE_HEIGHT,
        radius: BUILD_RADIUS,
        aspect: state.aspect,
      });
      let halfX = 0;
      gridPoints.forEach((point) => {
        halfX = Math.max(halfX, Math.abs(point.x));
      });
      const { halfWidth } = viewExtents(0);
      return (halfWidth * 0.97) / (halfX + TILE_WIDTH * 0.85);
    }

    // Retarget every tile. `immediate` skips the stagger, used on resize where nothing should animate.
    function applyShape(id, immediate = false) {
      const shape = getShape(id);
      const changed = shape.id !== state.shape.id;
      state.shape = shape;
      const points = buildShape(id, tiles.length, {
        tileWidth: TILE_WIDTH,
        tileHeight: TILE_HEIGHT,
        radius: BUILD_RADIUS,
        aspect: state.aspect,
      });

      const scale = state.baseFit;
      const { halfWidth, halfHeight } = viewExtents(0);

      // Spread the arrangement to the share of the screen this shape asks for. The grid is the
      // reference layout and is left exactly as built; everything else is stretched around it.
      if (shape.fitMode !== 'width') {
        let halfX = 0;
        let halfY = 0;
        points.forEach((point) => {
          halfX = Math.max(halfX, Math.abs(point.x));
          halfY = Math.max(halfY, Math.abs(point.y));
        });
        const fill = shape.fill ?? 1;
        // Target extents in world units, i.e. before the group is scaled for display.
        const targetX = Math.max((halfWidth * fill) / scale - TILE_WIDTH * 0.85, 0.1);
        const targetY = Math.max((halfHeight * fill) / scale - TILE_HEIGHT, 0.1);
        const spread = Math.min(halfX ? targetX / halfX : 1, halfY ? targetY / halfY : 1);
        points.forEach((point) => {
          point.x *= spread;
          point.y *= spread;
          point.z *= spread;
        });
      }

      // Centre the arrangement on the origin. Several shapes are naturally lopsided — the flock's
      // lobes, the grid's short last row, the dish in the sunflower — so without this they sit off to
      // one side of the screen.
      const bounds = points.reduce(
        (acc, point) => ({
          minX: Math.min(acc.minX, point.x),
          maxX: Math.max(acc.maxX, point.x),
          minY: Math.min(acc.minY, point.y),
          maxY: Math.max(acc.maxY, point.y),
          minZ: Math.min(acc.minZ, point.z),
          maxZ: Math.max(acc.maxZ, point.z),
        }),
        { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, minZ: Infinity, maxZ: -Infinity },
      );
      const centreX = (bounds.minX + bounds.maxX) / 2;
      const centreY = (bounds.minY + bounds.maxY) / 2;
      const centreZ = (bounds.minZ + bounds.maxZ) / 2;
      points.forEach((point) => {
        point.x -= centreX;
        point.y -= centreY;
        point.z -= centreZ;
      });

      // A new shape deals the clips out again; a resize keeps them where they are, since the
      // arrangement shouldn't scatter while the window is being dragged.
      if (changed || !state.order || state.order.length !== tiles.length) {
        state.order = shuffledOrder(tiles.length);
      }

      let longest = 0;
      let halfX = 0;
      let halfY = 0;
      tiles.forEach((tile, index) => {
        const point = points[state.order[index]] ?? { x: 0, y: 0, z: 0 };
        tile.target.set(point.x, point.y, point.z);
        tile.distance = tile.pos.distanceTo(tile.target);
        longest = Math.max(longest, tile.distance);
        halfX = Math.max(halfX, Math.abs(point.x));
        halfY = Math.max(halfY, Math.abs(point.y));
      });

      // Every shape draws at the same scale, so tiles never change size between views.
      state.fitTarget = scale;
      if (immediate) state.fit = state.fitTarget;

      // How far the viewer may drag before the content would leave the frame. Shapes that fit on
      // screen get a little slack; ones that overflow get exactly their overhang.
      const spanX = (halfX + TILE_WIDTH * 0.85) * scale;
      const spanY = (halfY + TILE_HEIGHT) * scale;
      state.panLimit = {
        x: Math.max(halfWidth * 0.3, spanX - halfWidth * 0.9),
        y: Math.max(halfHeight * 0.3, spanY - halfHeight * 0.9),
      };

      // A new shape starts from a neutral view rather than inheriting the last one's pan and zoom.
      if (changed && !immediate) {
        state.nav.velX = 0;
        state.nav.velY = 0;
        state.nav.velRotX = 0;
        state.nav.velRotY = 0;
      }

      tiles.forEach((tile) => {
        tile.delay = immediate || longest === 0 ? 0 : (1 - tile.distance / longest) * MAX_STAGGER;
      });
      state.morphClock = 0;

      if (immediate) {
        tiles.forEach((tile) => {
          tile.pos.copy(tile.target);
          tile.vel.set(0, 0, 0);
        });
      }
    }

    state.applyShape = applyShape;

    function resize() {
      const { clientWidth, clientHeight } = mount;
      if (!clientWidth || !clientHeight) return;
      // three.js sets the element's CSS size as well as the drawing buffer here; leaving it to style
      // the canvas at buffer size would double it on a retina screen and push the scene off-corner.
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      state.aspect = camera.aspect;
      // The grid defines the drawing scale for every shape, so it is measured before anything is built.
      state.baseFit = gridScale();
      // Rebuild rather than just rescale: the grid and wave lay themselves out to the window's shape.
      applyShape(state.shape.id, true);
    }

    const clock = new THREE.Clock();

    function frame() {
      if (!state.running) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      state.elapsed += delta;
      state.morphClock += delta;

      const { idle, tilt, nav: navMode } = state.shape;
      const still = state.reducedMotion;
      const nav = state.nav;

      state.fit += (state.fitTarget - state.fit) * Math.min(1, delta * 3.2);
      group.scale.setScalar(state.fit * nav.zoom);

      // Momentum after a drag, easing out rather than stopping dead.
      if (!state.dragging) {
        const decay = Math.pow(0.0015, delta);
        nav.panX += nav.velX * delta;
        nav.panY += nav.velY * delta;
        nav.rotY += nav.velRotY * delta;
        nav.rotX += nav.velRotX * delta;
        nav.velX *= decay;
        nav.velY *= decay;
        nav.velRotX *= decay;
        nav.velRotY *= decay;
      }
      nav.panX = clamp(nav.panX, -state.panLimit.x, state.panLimit.x);
      nav.panY = clamp(nav.panY, -state.panLimit.y, state.panLimit.y);
      // Turning is deliberately limited: past roughly a third of a turn you end up looking at the
      // arrangement edge-on or from behind, where there is nothing to see.
      if (nav.rotX !== clamp(nav.rotX, -MAX_ORBIT_X, MAX_ORBIT_X)) nav.velRotX = 0;
      if (nav.rotY !== clamp(nav.rotY, -MAX_ORBIT_Y, MAX_ORBIT_Y)) nav.velRotY = 0;
      nav.rotX = clamp(nav.rotX, -MAX_ORBIT_X, MAX_ORBIT_X);
      nav.rotY = clamp(nav.rotY, -MAX_ORBIT_Y, MAX_ORBIT_Y);

      // Shapes that are navigated by panning shouldn't also be rotated by leftover orbit.
      if (navMode === 'pan') {
        nav.rotX *= Math.max(0, 1 - delta * 3);
        nav.rotY *= Math.max(0, 1 - delta * 3);
      } else {
        nav.panX *= Math.max(0, 1 - delta * 3);
        nav.panY *= Math.max(0, 1 - delta * 3);
      }

      // Whole-group motion. Spin and swirl accumulate only for shapes that ask for them, and unwind
      // toward neutral for those that don't, so a shape never inherits the last one's angle.
      if (still) {
        state.spinY = 0;
        state.spinZ = 0;
      } else {
        state.spinY = idle.spin
          ? wrapAngle(state.spinY + idle.spin * delta)
          : wrapAngle(state.spinY) * Math.max(0, 1 - delta * 2.2);
        state.spinZ = idle.swirl
          ? wrapAngle(state.spinZ + idle.swirl * delta * 0.35)
          : wrapAngle(state.spinZ) * Math.max(0, 1 - delta * 2.2);
      }

      group.position.set(nav.panX, nav.panY, 0);
      group.rotation.x += (tilt.x + nav.rotX - group.rotation.x) * Math.min(1, delta * 2.4);
      group.rotation.y = state.spinY + nav.rotY;
      group.rotation.z = state.spinZ;

      // Tiles are children of the rotating group, so their own rotation is measured inside that turned
      // space. To face the camera they have to undo the group's rotation first — without this they
      // spin along with the group and go edge-on, disappearing as they pass the sides.
      group.updateMatrixWorld();
      group.getWorldQuaternion(groupQuaternion);
      billboardQuaternion.copy(groupQuaternion).invert().multiply(camera.quaternion);

      // Hover test, once per frame rather than per pointer event.
      let hovered = -1;
      if (state.pointerActive && !state.dragging) {
        state.raycaster.setFromCamera(state.pointer, camera);
        const hit = state.raycaster.intersectObjects(group.children, false)[0];
        if (hit) hovered = hit.object.userData.index;
      }
      if (hovered !== state.hovered) {
        state.hovered = hovered;
        callbacksRef.current.onHoverChange?.(hovered);
      }

      tiles.forEach((tile) => {
        if (state.morphClock >= tile.delay) {
          const wander = still || idle.amplitude === 0
            ? { x: 0, y: 0, z: 0 }
            : {
                x: drift(tile.seed, state.elapsed * idle.speed) * idle.amplitude,
                y: drift(tile.seed + 3.1, state.elapsed * idle.speed * 0.9) * idle.amplitude,
                z: drift(tile.seed + 7.7, state.elapsed * idle.speed * 1.1) * idle.amplitude * 0.6,
              };

          const dt = still ? 1 : delta;
          ['x', 'y', 'z'].forEach((axis) => {
            const to = tile.target[axis] + wander[axis];
            const force = (to - tile.pos[axis]) * STIFFNESS - tile.vel[axis] * DAMPING;
            tile.vel[axis] += force * dt;
            tile.pos[axis] += tile.vel[axis] * dt;
          });
        }

        tile.mesh.position.copy(tile.pos);

        tile.scaleTarget = tile.index === state.hovered ? 1.42 : 1;
        tile.scale += (tile.scaleTarget - tile.scale) * Math.min(1, delta * 9);
        tile.mesh.scale.setScalar(tile.scale);

        // Billboard: tiles always face the viewer. Most shapes also lean into their own motion for a
        // sense of weight, but shapes that circle continuously leave it off so the tiles glide around
        // squarely rather than appearing to tumble.
        tile.mesh.quaternion.copy(billboardQuaternion);
        if (!still && state.shape.lean !== false) {
          tile.mesh.rotateZ(THREE.MathUtils.clamp(tile.vel.x * 0.05, -0.22, 0.22));
        }
        tile.mesh.renderOrder = tile.index === state.hovered ? 1 : 0;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(frame);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();
    applyShape(shapeId, true);
    requestAnimationFrame(frame);

    function toPointer(event) {
      const rect = mount.getBoundingClientRect();
      state.pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      state.pointerActive = true;
    }

    // World units per screen pixel at the group's depth, so dragging moves content with the cursor.
    function worldPerPixel() {
      const { halfHeight } = viewExtents(0);
      return (halfHeight * 2) / Math.max(mount.clientHeight, 1);
    }

    function onPointerDown(event) {
      state.dragging = true;
      state.dragMoved = 0;
      state.lastPointer = { x: event.clientX, y: event.clientY };
      state.nav.velX = 0;
      state.nav.velY = 0;
      state.nav.velRotX = 0;
      state.nav.velRotY = 0;
      mount.setPointerCapture?.(event.pointerId);
    }

    function onPointerMove(event) {
      toPointer(event);
      if (!state.dragging) return;

      const dx = event.clientX - state.lastPointer.x;
      const dy = event.clientY - state.lastPointer.y;
      state.lastPointer = { x: event.clientX, y: event.clientY };
      state.dragMoved += Math.abs(dx) + Math.abs(dy);

      if (state.shape.nav === 'pan') {
        const scale = worldPerPixel();
        state.nav.panX += dx * scale;
        state.nav.panY -= dy * scale;
        // Velocity in world units per second, for the throw after release.
        state.nav.velX = dx * scale * 18;
        state.nav.velY = -dy * scale * 18;
      } else {
        state.nav.rotY += dx * 0.005;
        state.nav.rotX += dy * 0.003;
        state.nav.velRotY = dx * 0.09;
        state.nav.velRotX = dy * 0.05;
      }
    }

    function endDrag(event) {
      if (!state.dragging) return;
      state.dragging = false;
      mount.releasePointerCapture?.(event.pointerId);
    }

    function onPointerLeave() {
      state.pointerActive = false;
      state.pointer.set(-10, -10);
    }

    function onWheel(event) {
      event.preventDefault();
      if (state.shape.nav === 'pan') {
        // Scroll browses the wall, the way a page would.
        state.nav.panY += event.deltaY * worldPerPixel();
        state.nav.velY = 0;
      } else {
        state.nav.zoom = clamp(state.nav.zoom * (1 - event.deltaY * 0.0012), 0.55, 2.4);
      }
    }

    function onClick(event) {
      // A drag that ends over a tile shouldn't open it.
      if (state.dragMoved > DRAG_THRESHOLD) return;
      toPointer(event);
      state.raycaster.setFromCamera(state.pointer, camera);
      const hit = state.raycaster.intersectObjects(group.children, false)[0];
      if (hit) callbacksRef.current.onSelect?.(hit.object.userData.index);
    }

    mount.addEventListener('pointerdown', onPointerDown);
    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerup', endDrag);
    mount.addEventListener('pointercancel', endDrag);
    mount.addEventListener('pointerleave', onPointerLeave);
    mount.addEventListener('wheel', onWheel, { passive: false });
    mount.addEventListener('click', onClick);

    return () => {
      state.running = false;
      observer.disconnect();
      mount.removeEventListener('pointerdown', onPointerDown);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerup', endDrag);
      mount.removeEventListener('pointercancel', endDrag);
      mount.removeEventListener('pointerleave', onPointerLeave);
      mount.removeEventListener('wheel', onWheel);
      mount.removeEventListener('click', onClick);
      tiles.forEach((tile) => {
        tile.texture.dispose();
        tile.mesh.material.dispose();
      });
      geometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      sceneRef.current = null;
    };
    // Items are fixed for the life of the page; changing them should rebuild the scene.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, reducedMotion]);

  // Shape changes retarget the existing tiles rather than rebuilding anything.
  useEffect(() => {
    sceneRef.current?.applyShape?.(shapeId);
  }, [shapeId]);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.reducedMotion = reducedMotion;
  }, [reducedMotion]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
      aria-label="Video gallery"
    />
  );
}
