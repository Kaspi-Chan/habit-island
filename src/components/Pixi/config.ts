export const WORLD_WIDTH = 1440;
export const WORLD_HEIGHT = 1440;
export const BASE_TILE = 32;
export const WORLD_SCALE = 3;
export const TILE_SIZE = BASE_TILE * WORLD_SCALE; // 96px
export const ROWS = WORLD_HEIGHT / TILE_SIZE; // 30
export const COLS = WORLD_WIDTH / TILE_SIZE; // 30

export const FORBIDDEN_COORDINATES = [
  // Top right water
  [12, 2],
  [13, 2],
  [14, 2],
  [12, 3],
  [13, 3],
  [14, 3],
  [12, 4],
  [13, 4],
  [14, 4],
  // Bottom left water
  [0, 13],
  [1, 13],
  [2, 13],
  [3, 13],
  [4, 13],
  [5, 13],
  [6, 13],
  [0, 14],
  [1, 14],
  [2, 14],
  [3, 14],
  [4, 14],
  [5, 14],
  [6, 14],
  // BIG ROCK
  [8, 11],
  [9, 11],
  [10, 11],
  [11, 11],
];
