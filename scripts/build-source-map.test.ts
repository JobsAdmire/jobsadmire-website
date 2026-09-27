import { describe, expect, it } from 'vitest';
import { SOURCE_MAP_CODES } from '../src/design/assets/source-map-codes';
import { buildSourceMap, VIEWBOX } from './build-source-map';

describe('build-source-map', () => {
  const { tsx, markers } = buildSourceMap();

  it('plots the 13 source countries (W1: + LK) and Türkiye inside the design viewBox', () => {
    expect(VIEWBOX).toEqual({ width: 640, height: 397 });
    for (const code of [...SOURCE_MAP_CODES, 'TR'] as const) {
      const m = markers[code];
      expect(m.x).toBeGreaterThan(0);
      expect(m.x).toBeLessThan(640);
      expect(m.y).toBeGreaterThan(0);
      expect(m.y).toBeLessThan(397);
      expect(tsx).toContain(`data-country="${code}"`); // W40: upper-case
    }
    // Sri Lanka sits south-east of Pakistan; Senegal is the western edge; Türkiye is north of Mali.
    expect(markers.LK.x).toBeGreaterThan(markers.PK.x);
    expect(markers.LK.y).toBeGreaterThan(markers.PK.y);
    expect(markers.SN.x).toBeLessThan(markers.ML.x);
    expect(markers.TR.y).toBeLessThan(markers.ML.y);
  });

  it('emits a self-contained server component: land paths, 13 arcs, titles, no runtime imports', () => {
    expect(tsx).toContain("import type { SourceMapCode } from './source-map-codes';");
    expect(tsx).not.toMatch(/from ['"](d3|d3-geo|topojson|topojson-client|world-atlas)/);
    expect((tsx.match(/className="source-map__arc"/g) ?? []).length).toBe(13);
    expect((tsx.match(/<title>\{labels\.[A-Z]{2}\}<\/title>/g) ?? []).length).toBe(13);
    expect((tsx.match(/\{turkiyeLabel\}/g) ?? []).length).toBe(2); // <title> + the visible <text>
    expect(tsx).not.toContain('>Türkiye<'); // W9: no hard-coded label
    expect((tsx.match(/<path d="/g) ?? []).length).toBeGreaterThan(60); // clipped world, per-country paths
    expect(tsx).toContain('fill="#1899D5"'); // Türkiye
    expect(tsx).toContain('fill="#cfe6f4"'); // source countries
    expect(tsx).toContain('pathLength="1"');
    expect(tsx).toContain('export function SourceMap(');
  });

  it('is deterministic', () => {
    expect(buildSourceMap().tsx).toBe(tsx);
  });
});
