import {
  createAnimatedSprite,
  debugHitArea,
} from "../../../utils/pixi/index.js";
import { COLS, ROWS, TILE_SIZE } from "../config.js";
import {
  AnimatedSprite,
  Container,
  Graphics,
  Rectangle,
  Sprite,
} from "pixi.js";
import { staticObstacles } from "../setup.js";

const waterTile = [
  { x: 12, y: 3 },
  { x: 12, y: 4 },
  { x: 13, y: 3 },
  { x: 13, y: 4 },
  { x: 14, y: 3 },
  { x: 14, y: 4 },
  { x: 15, y: 3 },
  { x: 15, y: 4 },
  //   bottom
  { x: 0, y: 13.25, half: true },
  { x: 1, y: 13.25, half: true },
  { x: 2, y: 13.25, half: true },
  { x: 3, y: 13.25, half: true },
  { x: 4, y: 13.25, half: true },
  { x: 5, y: 13.25, half: true },
  { x: 6, y: 13.25, half: true },
  { x: 3, y: 14 },
  { x: 4, y: 14 },
  { x: 5, y: 14 },
  { x: 6, y: 14 },
  { x: 0, y: 14.75, half: true },
  { x: 1, y: 14.75, half: true },
  { x: 2, y: 14.75, half: true },
];

export const addWaterTiles = () => {
  const waterTileContainer = new Container();

  waterTile.forEach((tile) => {
    const screenX = tile.x * TILE_SIZE;
    const screenY = tile.y * TILE_SIZE;

    const animationSpeed = 0.02;
    const animatedWaterTile = createAnimatedSprite(
      "water-anim",
      4,
      32,
      tile.half ? 16 : 32,
      screenX,
      screenY,
      3,
      animationSpeed
    );

    waterTileContainer.addChild(animatedWaterTile);
    animatedWaterTile.gotoAndPlay(Math.floor(Math.random() * 4));
  });

  return waterTileContainer;
};
