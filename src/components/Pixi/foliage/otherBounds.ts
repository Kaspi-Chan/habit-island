import { Assets, Container, Rectangle, Sprite } from "pixi.js";
import { TILE_SIZE, WORLD_SCALE } from "../config";
import { Viewport } from "pixi-viewport";
import { staticObstacles } from "../setup";

const otherStaticObstacles = [
  {
    x: 3.15,
    y: 6.15,
    size: { x: TILE_SIZE * 2.25, y: TILE_SIZE * 0.75 },
    offset: { x: 0, y: 0 },
    alias: "big-log",
  },
  {
    x: 8,
    y: 9.75,
    size: { x: TILE_SIZE * 3 + 20, y: TILE_SIZE },
    offset: { x: TILE_SIZE / 2 - 10, y: TILE_SIZE * 1.5 },
    alias: "rock",
  },
];

export const loadOtherObjects = (viewport: Viewport) => {
  otherStaticObstacles.forEach((item) => {
    const { x, y, size, offset, alias } = item;
    const texture = Assets.get(alias);
    const sprite = new Sprite(texture);

    const screenX = x * TILE_SIZE;
    const screenY = y * TILE_SIZE;

    sprite.position.set(screenX, screenY);
    sprite.scale.set(WORLD_SCALE);
    sprite.zIndex = 50;

    const hitbox = new Rectangle(
      screenX + offset.x,
      screenY + offset.y,
      size.x,
      size.y
    );

    staticObstacles.push(hitbox);
    viewport.addChild(sprite);
  });
};
