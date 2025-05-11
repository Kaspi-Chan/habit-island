export const WORLD_WIDTH = 1440;
export const WORLD_HEIGHT = 1440;
export const BASE_TILE = 32;
export const WORLD_SCALE = 3;
export const TILE_SIZE = BASE_TILE * WORLD_SCALE; // 96px
export const ROWS = WORLD_HEIGHT / TILE_SIZE; // 30
export const COLS = WORLD_WIDTH / TILE_SIZE; // 30

export const BOUNDS = [
  { x: 0, y: 13, size: { x: TILE_SIZE * 7, y: TILE_SIZE * 2 } },
  { x: 12, y: 2, size: { x: TILE_SIZE * 3, y: TILE_SIZE * 3 } },
];
