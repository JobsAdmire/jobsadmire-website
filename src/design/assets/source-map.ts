/** Pages import the map from here, never from the generated file directly, so a regeneration
 *  or a future hand-written replacement changes one line. */
export {
  SourceMap,
  SOURCE_MAP_MARKERS,
  SOURCE_MAP_VIEWBOX,
  type SourceMapProps,
} from './source-map.generated';
export {
  SOURCE_MAP_CODES,
  SOURCE_MAP_POINTS,
  isSourceMapCode,
  sourceMapLabels,
  type SourceMapCode,
} from './source-map-codes';
