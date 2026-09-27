import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { geoMercator, geoPath } from 'd3-geo';
import type { FeatureCollection, LineString, MultiPoint } from 'geojson';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import {
  SOURCE_MAP_CODES,
  SOURCE_MAP_POINTS,
  TURKIYE_POINT,
  type SourceMapCode,
} from '../src/design/assets/source-map-codes';

const ROOT = join(__dirname, '..');
const ATLAS = join(ROOT, 'node_modules', 'world-atlas', 'countries-110m.json');
const OUT = join(ROOT, 'src', 'design', 'assets', 'source-map.generated.tsx');

/** The design renders at its container width (default 640) with H = round(W × 0.62). */
export const VIEWBOX = { width: 640, height: 397 } as const;
const INSET: [[number, number], [number, number]] = [
  [16, 18],
  [VIEWBOX.width - 16, VIEWBOX.height - 18],
];

const FILL = { turkiye: '#1899D5', source: '#cfe6f4', other: '#eaf1f6' } as const;

type Marker = { x: number; y: number };
const r1 = (n: number) => Math.round(n * 10) / 10;

export function buildSourceMap(): {
  tsx: string;
  markers: Record<SourceMapCode | 'TR', Marker>;
} {
  const topo = JSON.parse(readFileSync(ATLAS, 'utf8')) as Topology;
  const countries = feature(
    topo,
    topo.objects.countries as GeometryCollection,
  ) as FeatureCollection;

  const points: MultiPoint = {
    type: 'MultiPoint',
    coordinates: [
      ...SOURCE_MAP_CODES.map((c) => [SOURCE_MAP_POINTS[c].lon, SOURCE_MAP_POINTS[c].lat]),
      [TURKIYE_POINT.lon, TURKIYE_POINT.lat],
    ],
  };
  // clipExtent first: d3's fit* ignores it while fitting and restores it afterwards, so land
  // outside the viewBox (Americas, Antarctica) is cut at the edge instead of shipped.
  const projection = geoMercator()
    .clipExtent([
      [0, 0],
      [VIEWBOX.width, VIEWBOX.height],
    ])
    .fitExtent(INSET, points);
  const path = geoPath(projection).digits(1);

  const sourceIds = new Set(SOURCE_MAP_CODES.map((c) => SOURCE_MAP_POINTS[c].atlasId));
  const land: string[] = [];
  const sorted = [...countries.features].sort((a, b) => String(a.id).localeCompare(String(b.id)));
  for (const f of sorted) {
    const d = path(f);
    if (!d) continue; // entirely outside the clip extent
    const id = String(f.id);
    const fill =
      id === TURKIYE_POINT.atlasId ? FILL.turkiye : sourceIds.has(id) ? FILL.source : FILL.other;
    land.push(`        <path d="${d}" fill="${fill}" stroke="#ffffff" strokeWidth="0.7" />`);
  }

  const project = (lon: number, lat: number): Marker => {
    const p = projection([lon, lat]);
    if (!p) throw new Error(`unprojectable point ${lon},${lat}`);
    return { x: r1(p[0]), y: r1(p[1]) };
  };
  const markers = Object.fromEntries(
    SOURCE_MAP_CODES.map((c) => [c, project(SOURCE_MAP_POINTS[c].lon, SOURCE_MAP_POINTS[c].lat)]),
  ) as Record<SourceMapCode, Marker>;
  const TR = project(TURKIYE_POINT.lon, TURKIYE_POINT.lat);

  const arcs = SOURCE_MAP_CODES.map((c, i) => {
    const line: LineString = {
      type: 'LineString',
      coordinates: [
        [SOURCE_MAP_POINTS[c].lon, SOURCE_MAP_POINTS[c].lat],
        [TURKIYE_POINT.lon, TURKIYE_POINT.lat],
      ],
    };
    const d = path(line) ?? '';
    const delay = (0.22 + i * 0.11).toFixed(2);
    return `        <path className="source-map__arc" pathLength="1" d="${d}" style={{ animationDelay: '${delay}s' }} />`;
  });

  const dots = SOURCE_MAP_CODES.map((c, i) => {
    const m = markers[c];
    const delay = (0.7 + i * 0.26).toFixed(2);
    return [
      `        <g data-country="${c}" transform="translate(${m.x},${m.y})">`,
      `          <title>{labels.${c}}</title>`,
      `          <circle r="4.5" fill="#1073a8" stroke="#ffffff" strokeWidth="1.6" />`,
      `          <circle className="source-map__pulse" r="4.5" fill="none" stroke="#1899D5" strokeWidth="1.4" style={{ animationDelay: '${delay}s' }} />`,
      `        </g>`,
    ].join('\n');
  });

  const markerLiteral = JSON.stringify({ ...markers, TR }, null, 2).replace(/"(\w+)":/g, '$1:');

  const tsx = `/* GENERATED FILE — do not edit by hand. Regenerate with \`npm run assets:map\`.
 * Source: design-package/design/source-map.js (12 countries + LK per ruling W1) projected with
 * d3-geo's Mercator, fitted to the 14 points inside a ${VIEWBOX.width}×${VIEWBOX.height} viewBox with the design's
 * 16/18 px inset, over world-atlas@2.0.2 countries-110m (Natural Earth, public domain). Nothing
 * here is fetched or computed at runtime (W14). Styling: .source-map__* in globals.css. */
import type { SourceMapCode } from './source-map-codes';

export const SOURCE_MAP_VIEWBOX = { width: ${VIEWBOX.width}, height: ${VIEWBOX.height} } as const;

export const SOURCE_MAP_MARKERS: Record<SourceMapCode | 'TR', { x: number; y: number }> = ${markerLiteral};

export type SourceMapProps = {
  /** Accessible name of the whole figure (sys copy). */
  title: string;
  /** Localized country names, one per marker — \`sourceMapLabels(getCollection(bundle, 'sourceCountries'))\`. */
  labels: Record<SourceMapCode, string>;
  /** The Türkiye marker's label (W9: the design's hard-coded "Türkiye" is a prop). */
  turkiyeLabel: string;
  /** Unique per instance when a page mounts the map twice. */
  id?: string;
  className?: string;
};

/** The sourcing map (Homepage agent-network split, Hire Workers source countries). Desktop
 *  only in the design (hidden ≤460 by class, W10); the phone card lists Flag chips instead. */
export function SourceMap({ title, labels, turkiyeLabel, id = 'source-map', className }: SourceMapProps) {
  return (
    <svg
      viewBox="0 0 ${VIEWBOX.width} ${VIEWBOX.height}"
      role="img"
      aria-labelledby={\`\${id}-title\`}
      className={className}
      style={{ display: 'block', width: '100%', height: 'auto', overflow: 'hidden' }}
    >
      <title id={\`\${id}-title\`}>{title}</title>
      <g className="source-map__land">
${land.join('\n')}
      </g>
      <g className="source-map__arcs" fill="none" stroke="#1899D5" strokeWidth="1.4" strokeLinecap="round" opacity="0.55">
${arcs.join('\n')}
      </g>
      <g className="source-map__markers">
${dots.join('\n')}
      </g>
      <g data-country="TR" transform="translate(${TR.x},${TR.y})">
        <title>{turkiyeLabel}</title>
        <circle r="7" fill="#16a34a" stroke="#ffffff" strokeWidth="2.2" />
        <text y="-14" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f5c2e" stroke="#ffffff" strokeWidth="3.5" paintOrder="stroke">
          {turkiyeLabel}
        </text>
      </g>
    </svg>
  );
}
`;
  return { tsx, markers: { ...markers, TR } };
}

if (require.main === module) {
  const { tsx } = buildSourceMap();
  writeFileSync(OUT, tsx);
  console.log(`source-map.generated.tsx: ${(tsx.length / 1024).toFixed(1)} KB → ${OUT}`);
}
