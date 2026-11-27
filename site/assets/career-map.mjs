const STOPS = [-.83, -.415, 0, .415, .83];
const COLUMNS = 52;
const ROWS = 18;
const BASE = -.115;
const LEVELS = [.12, .18, .24, .30, .36, .42, .48, .54, .60];

const palettes = {
  dark: {
    floor: [16, 19, 53], ridge: [80, 104, 171], lit: [36, 45, 62],
    walls: ['#33366f', '#10152e'], contours: ['#b1c3ff38', '#ccddff82'],
    edge: '#a2baff5c', seams: '#c4c4ff36', mist: '#767df545',
    track: ['#9c78ff', '#d3baff', '#9be4ff'], trackGlow: '#ad9cff',
    trackEdge: '#9d74ff47', node: '#e9e7ff', active: '#caf4ff', halo: '#99d8ff84',
  },
  light: {
    floor: [95, 102, 170], ridge: [168, 187, 236], lit: [31, 32, 21],
    walls: ['#8795cd', '#515d97'], contours: ['#f1f4ff63', '#f6fcffb0'],
    edge: '#e2eaffaf', seams: '#e4ecff70', mist: '#7977ba3c',
    track: ['#cfbcff', '#f6ecff', '#d3f6ff'], trackGlow: '#bba0ff',
    trackEdge: '#6044a783', node: '#ffffff', active: '#eaffff', halo: '#d8f6ffac',
  },
};

const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const interpolate = (from, to, amount) => from + (to - from) * amount;
const hill = (value, width) => Math.exp(-((value / width) ** 2));

function terrainPoint(x, across) {
  const ridgeAxis = -.20 + .14 * Math.sin(x * 4.2) - .09 * Math.sin(x * 8.3 + .5);
  const spine = hill(across - ridgeAxis, .39) * (.29 + .075 * Math.sin(x * 6.1 - .8));
  const westernPeak = .28 * hill(x + .58, .28) * hill(across + .37, .40);
  const easternPeak = .37 * hill(x - .52, .37) * hill(across + .10, .43);
  const foothills = .16 * hill(x + .06, .60) * hill(across - .56, .35);
  const erosion = .026 * Math.sin(x * 22 + across * 16) + .019 * Math.cos(x * 38 - across * 13);
  const taper = 1 - .66 * Math.abs(x) ** 5;
  const elevation = .07 + taper * (spine + westernPeak + easternPeak + foothills + erosion);
  const width = .92 - .31 * x ** 4 + .042 * Math.sin(x * 10 + .3);
  const depth = across * width + .045 * Math.sin(x * 8.1);
  return { x, depth, elevation };
}

function routePoint(x) {
  const across = .095 + .17 * Math.sin(x * 5.2 - .7) - .11 * Math.cos(x * 9 + .4);
  const point = terrainPoint(x, across);
  point.elevation += .025;
  return point;
}

function contour(triangle, level) {
  const ends = [];
  for (let index = 0; index < 3; index++) {
    const a = triangle[index];
    const b = triangle[(index + 1) % 3];
    if ((a.elevation < level) === (b.elevation < level)) continue;
    const ratio = (level - a.elevation) / (b.elevation - a.elevation);
    ends.push({ x: interpolate(a.x, b.x, ratio), depth: interpolate(a.depth, b.depth, ratio), elevation: level });
  }
  return ends;
}

function createModel() {
  const grid = Array.from({ length: ROWS + 1 }, (_, row) => (
    Array.from({ length: COLUMNS + 1 }, (_, col) => {
      const x = 2 * col / COLUMNS - 1;
      let across = 2 * row / ROWS - 1;
      // Break up the regular cell pattern while keeping the outer rim continuous.
      if (row > 0 && row < ROWS && col > 0 && col < COLUMNS) {
        across += .025 * Math.sin(row * 11.1 + col * 5.17);
      }
      return terrainPoint(x, across);
    })
  ));
  const roof = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const a = grid[row][col];
      const b = grid[row][col + 1];
      const c = grid[row + 1][col];
      const d = grid[row + 1][col + 1];
      roof.push(...((row + col) % 2 ? [[a, b, d], [a, d, c]] : [[a, b, c], [b, d, c]]));
    }
  }
  const rim = [
    ...grid[0],
    ...grid.slice(1, -1).map((row) => row.at(-1)),
    ...grid.at(-1).slice().reverse(),
    ...grid.slice(1, -1).reverse().map((row) => row[0]),
  ];
  const contours = LEVELS.map((level) => roof.map((triangle) => contour(triangle, level)).filter((line) => line.length === 2));
  return { vertices: grid.flat(), roof, rim, contours };
}

function createProjection(width, height, yaw, pitch) {
  const yawCos = Math.cos(yaw);
  const yawSin = Math.sin(yaw);
  const pitchCos = Math.cos(pitch);
  const pitchSin = Math.sin(pitch);
  return ({ x, depth, elevation }) => {
    const east = x * yawCos - depth * yawSin * .37;
    const back = depth * yawCos + x * yawSin * .69;
    const vertical = back * pitchSin * .68 - elevation * pitchCos;
    const perspective = 1 + (back * pitchCos + elevation * pitchSin) * .055;
    return { x: width * (.5 + east * perspective * .465), y: height * (.565 + vertical * perspective * .71), back };
  };
}

function trace(ctx, points, close = false) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index++) ctx.lineTo(points[index].x, points[index].y);
  if (close) ctx.closePath();
}

function facetColor(triangle, palette) {
  const [a, b, c] = triangle;
  const dx = b.x - a.x;
  const dz = b.depth - a.depth;
  const dy = b.elevation - a.elevation;
  const ex = c.x - a.x;
  const ez = c.depth - a.depth;
  const ey = c.elevation - a.elevation;
  const nx = dy * ez - dz * ey;
  const ny = dz * ex - dx * ez;
  const nz = dx * ey - dy * ex;
  const lighting = (nx * -.36 + Math.abs(ny) * .76 + nz * .53) / Math.hypot(nx, ny, nz);
  const elevation = clamp((a.elevation + b.elevation + c.elevation) / 1.85, 0, 1);
  const rgb = palette.floor.map((channel, index) => Math.round(
    interpolate(channel, palette.ridge[index], elevation) + palette.lit[index] * (lighting - .45),
  ));
  return `rgb(${rgb.join(',')})`;
}

function drawTerrain(ctx, model, project, width, height, palette, facetColors) {
  const { vertices, roof, rim, contours } = model;
  for (const vertex of vertices) vertex.screen = project(vertex);
  const ground = rim.map((point) => project({ ...point, elevation: BASE }));
  const edge = rim.map((point) => point.screen);

  ctx.save();
  ctx.shadowColor = palette.mist;
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 9;
  ctx.fillStyle = palette.walls[1];
  trace(ctx, ground, true);
  ctx.fill();
  ctx.restore();

  const wall = ctx.createLinearGradient(0, height * .46, 0, height * .89);
  wall.addColorStop(0, palette.walls[0]);
  wall.addColorStop(1, palette.walls[1]);
  for (let index = 0; index < rim.length; index++) {
    const next = (index + 1) % rim.length;
    // The visible face winds opposite its back-facing counterpart.
    if (edge[index].x < edge[next].x) continue;
    trace(ctx, [edge[index], edge[next], ground[next], ground[index]], true);
    ctx.fillStyle = wall;
    ctx.fill();
    ctx.lineWidth = .7;
    ctx.strokeStyle = wall;
    ctx.stroke();
    if (index % 3 !== 0) continue;
    trace(ctx, [edge[index], ground[index]]);
    ctx.strokeStyle = palette.seams;
    ctx.stroke();
  }

  ctx.lineWidth = .65;
  for (let index = 0; index < roof.length; index++) {
    const [a, b, c] = roof[index];
    ctx.strokeStyle = ctx.fillStyle = facetColors[index];
    ctx.beginPath();
    ctx.moveTo(a.screen.x, a.screen.y);
    ctx.lineTo(b.screen.x, b.screen.y);
    ctx.lineTo(c.screen.x, c.screen.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  for (let index = 0; index < contours.length; index++) {
    ctx.beginPath();
    for (const segment of contours[index]) {
      const [a, b] = segment.map(project);
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    const major = index % 3 === 2;
    ctx.lineWidth = major ? .85 : .55;
    ctx.strokeStyle = palette.contours[major ? 1 : 0];
    ctx.stroke();
  }

  trace(ctx, edge, true);
  ctx.strokeStyle = palette.edge;
  ctx.lineWidth = .9;
  ctx.stroke();

  const atmosphere = ctx.createRadialGradient(width * .58, height * .40, 0, width * .58, height * .40, width * .47);
  atmosphere.addColorStop(0, palette.mist);
  atmosphere.addColorStop(1, 'transparent');
  ctx.fillStyle = atmosphere;
  ctx.fillRect(0, 0, width, height);
}

function pointAlongRoute(points, position) {
  const index = Math.floor(position);
  const current = points[index];
  const next = points[Math.min(index + 1, points.length - 1)];
  return {
    x: interpolate(current.x, next.x, position - index),
    y: interpolate(current.y, next.y, position - index),
  };
}

function drawRoute(ctx, points, anchors, activeIndex, palette, phase, compact) {
  const start = points[0];
  const end = points.at(-1);
  const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
  palette.track.forEach((color, index) => gradient.addColorStop(index / 2, color));
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  trace(ctx, points);
  ctx.lineWidth = compact ? 4.4 : 6;
  ctx.strokeStyle = palette.trackEdge;
  ctx.shadowBlur = 11;
  ctx.shadowColor = palette.trackGlow;
  ctx.stroke();
  ctx.lineWidth = compact ? 1.6 : 2.1;
  ctx.strokeStyle = gradient;
  ctx.stroke();
  if (phase !== null) {
    const head = phase * (points.length - 1);
    const tail = Math.max(0, head - 12);
    if (head > tail) {
      const from = pointAlongRoute(points, tail);
      const to = pointAlongRoute(points, head);
      const glimmer = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
      glimmer.addColorStop(0, 'transparent');
      glimmer.addColorStop(1, '#ffffff');
      trace(ctx, [from, ...points.slice(Math.floor(tail) + 1, Math.ceil(head)), to]);
      ctx.lineWidth = compact ? 2.2 : 2.8;
      ctx.strokeStyle = glimmer;
      ctx.stroke();
    }
  }

  for (let index = 0; index < anchors.length; index++) {
    const { x, y } = anchors[index];
    const active = index === activeIndex;
    const radius = active ? (compact ? 4.7 : 5.4) : 2.9;
    if (active) {
      const ripple = phase === null ? 0 : (1 - Math.cos(phase * Math.PI * 4)) * 1.7;
      ctx.beginPath();
      ctx.arc(x, y, radius + 4.4 + ripple, 0, Math.PI * 2);
      ctx.strokeStyle = palette.halo;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = active ? palette.active : palette.node;
    ctx.fill();
  }
  ctx.restore();
}

export function createTerrain(canvas, onProject) {
  const context = canvas.getContext('2d');
  const stage = canvas.parentElement;
  if (!context || !stage) return null;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const root = document.documentElement;
  const route = Array.from({ length: 109 }, (_, index) => routePoint(interpolate(STOPS[0], STOPS.at(-1), index / 108)));
  const stops = STOPS.map(routePoint);

  let activeIndex = stops.length - 1;
  let angles = { yaw: -.14, pitch: .75 };
  let resting = { ...angles };
  let target = { ...angles };
  let drag;
  let directPosePending = false;
  let width = 0;
  let height = 0;
  let scale = 1;
  let frame = 0;
  let lastPaint = -Infinity;
  let visible = !('IntersectionObserver' in window);
  let model;
  let layer;
  let layerContext;
  let terrainPalette;
  let facetColors;
  let terrainDirty = true;
  let anchors = [];
  let path = [];
  let project;

  function paletteForTheme() {
    const theme = root.dataset.theme;
    return palettes[theme === 'light' || theme === 'dark' ? theme : (colorScheme.matches ? 'dark' : 'light')];
  }

  function updateProjection() {
    if (!width || !height) return;
    project = createProjection(width, height, angles.yaw, angles.pitch);
    path = route.map(project);
    anchors = stops.map(project);
    onProject(anchors.map(({ x, y }) => ({ x: x / width, y: y / height })));
    terrainDirty = true;
  }

  function requestPaint() {
    if (!frame && visible && !document.hidden && width && height) frame = window.requestAnimationFrame(paint);
  }

  function measure() {
    const bounds = canvas.getBoundingClientRect();
    const nextScale = Math.min(window.devicePixelRatio || 1, 2);
    if (bounds.width === width && bounds.height === height && nextScale === scale) return;
    width = bounds.width;
    height = bounds.height;
    scale = nextScale;
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    updateProjection();
    requestPaint();
  }

  function paint(time) {
    frame = 0;
    if (!visible || document.hidden) return;
    const reduced = motion.matches;
    const elapsed = time - lastPaint;
    const movement = Math.abs(angles.yaw - target.yaw) + Math.abs(angles.pitch - target.pitch);
    const moving = movement > (directPosePending ? 0 : .001);
    if (!reduced && !moving && !terrainDirty && elapsed < 29) {
      requestPaint();
      return;
    }
    lastPaint = time;

    if (moving) {
      const ease = directPosePending ? 1 : 1 - Math.exp(-Math.min(elapsed, 48) / 56);
      angles = {
        yaw: interpolate(angles.yaw, target.yaw, ease),
        pitch: interpolate(angles.pitch, target.pitch, ease),
      };
      updateProjection();
    }
    directPosePending = false;

    const palette = paletteForTheme();
    if (!layer) {
      layer = document.createElement('canvas');
      layerContext = layer.getContext('2d');
      model = createModel();
    }
    if (terrainDirty) {
      if (layer.width !== canvas.width) layer.width = canvas.width;
      if (layer.height !== canvas.height) layer.height = canvas.height;
      if (palette !== terrainPalette) {
        facetColors = model.roof.map((triangle) => facetColor(triangle, palette));
        terrainPalette = palette;
      }
      layerContext.resetTransform();
      layerContext.clearRect(0, 0, layer.width, layer.height);
      layerContext.setTransform(scale, 0, 0, scale, 0, 0);
      drawTerrain(layerContext, model, project, width, height, palette, facetColors);
      terrainDirty = false;
    }

    context.resetTransform();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(layer, 0, 0);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    drawRoute(context, path, anchors, activeIndex, palette, reduced ? null : (time % 5100) / 5100, width < 420);
    if (!reduced) requestPaint();
  }

  function repaintTerrain() {
    terrainDirty = true;
    requestPaint();
  }

  function finishDrag(event) {
    if (drag?.id !== event.pointerId) return;
    if (drag.started) resting = { ...target };
    drag = undefined;
    delete stage.dataset.dragging;
  }

  stage.addEventListener('pointerdown', (event) => {
    if (motion.matches || !event.isPrimary || event.button !== 0 || event.target.closest('button, a, input')) return;
    target = angles;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, start: angles, started: false };
  });
  stage.addEventListener('pointermove', (event) => {
    if (motion.matches) return;
    if (drag?.id === event.pointerId) {
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.started && (Math.hypot(dx, dy) < 6 || (event.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx)))) return;
      if (!drag.started) {
        drag.started = true;
        stage.dataset.dragging = '';
        stage.setPointerCapture(event.pointerId);
      }
      // Positive yaw moves the near edge left, so grab motion uses the opposite sign.
      target = {
        yaw: clamp(drag.start.yaw - dx / width * .82, -.42, .18),
        pitch: clamp(drag.start.pitch + dy / height * .43, .63, .89),
      };
      directPosePending = true;
    } else if (event.pointerType === 'mouse') {
      const bounds = stage.getBoundingClientRect();
      target = {
        yaw: clamp(resting.yaw - ((event.clientX - bounds.left) / width - .5) * .08, -.42, .18),
        pitch: clamp(resting.pitch + ((event.clientY - bounds.top) / height - .5) * .08, .63, .89),
      };
    }
    requestPaint();
  });
  stage.addEventListener('pointerleave', (event) => {
    if (drag?.started) return;
    finishDrag(event);
    target = { ...resting };
    requestPaint();
  });
  for (const eventName of ['pointerup', 'pointercancel', 'lostpointercapture']) stage.addEventListener(eventName, finishDrag);

  motion.addEventListener('change', () => {
    if (motion.matches) {
      drag = undefined;
      delete stage.dataset.dragging;
      target = resting = angles = { yaw: -.14, pitch: .75 };
      updateProjection();
    }
    requestPaint();
  });
  colorScheme.addEventListener('change', repaintTerrain);
  new MutationObserver(repaintTerrain).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  document.addEventListener('visibilitychange', requestPaint);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(canvas);
  window.addEventListener('resize', measure);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      requestPaint();
    }).observe(stage);
  }

  measure();
  return {
    setActive(index) {
      if (!Number.isInteger(index) || index < 0 || index >= stops.length) return;
      activeIndex = index;
      requestPaint();
    },
  };
}
