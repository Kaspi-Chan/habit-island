import { Assets, Container, Rectangle, Sprite } from "pixi.js";
import { TILE_SIZE, WORLD_SCALE } from "../config";
import { Viewport } from "pixi-viewport";
import { staticObstacles } from "../setup";

interface StaticObjects {
  x: number;
  y: number;
  scale?: number;
  size?: { x: number; y: number };
  offset?: { x: number; y: number };
  alias: string;
}

const foliage: StaticObjects[] = [
  { x: 4, y: 1.5, scale: 1.6, alias: "bush" },
  { x: 8.5, y: 1, scale: 1.6, alias: "bush" },
  { x: 11.5, y: 1, scale: 1.6, alias: "bush" },
  { x: 14, y: 1, scale: 1.6, alias: "bush" },
  // 2nd row
  { x: 2, y: 5.5, scale: 1.6, alias: "bush" },
  { x: 6, y: 5.5, scale: 1.6, alias: "bush" },
  { x: 11, y: 6.25, scale: 1.6, alias: "bush" },
  { x: 12, y: 7, scale: 1.6, alias: "bush" },
  // big bushes
  { x: 6.1, y: 0.65, alias: "bush" },
  // 2nd row
  { x: 3.1, y: 7.15, alias: "bush" },
  { x: 1.6, y: 8.15, alias: "bush" },
  { x: 13.1, y: 5.65, alias: "bush" },
  { x: 13.1, y: 7.15, alias: "bush" },
  // 3rd row
  { x: 8.57, y: 12.65, alias: "bush" },
  { x: 11.1, y: 13, alias: "bush" },
  { x: 12.6, y: 11.5, alias: "bush" },
  { x: 13.6, y: 13.15, alias: "bush" },
  // log
  {
    x: 3.15,
    y: 6.15,
    size: { x: TILE_SIZE * 2.25, y: TILE_SIZE * 0.75 },
    offset: { x: 0, y: 0 },
    alias: "big-log",
  },
  // rock
  {
    x: 8,
    y: 9.75,
    size: { x: TILE_SIZE * 3 + 20, y: TILE_SIZE },
    offset: { x: TILE_SIZE / 2 - 10, y: TILE_SIZE * 1.5 },
    alias: "rock",
  },
];

export const populateWithFoliage = () => {
  const foliageContainer = new Container();
  foliageContainer.zIndex = 50;

  foliage.forEach((item) => {
    const { x, y, alias, scale = WORLD_SCALE } = item;

    const texture = Assets.get(alias);
    const bushSprite = new Sprite(texture);

    const screenX = x * TILE_SIZE;
    const screenY = y * TILE_SIZE;

    bushSprite.position.set(screenX, screenY);
    bushSprite.scale.set(scale);

    const boxW = item.size?.x ?? TILE_SIZE * 0.3 * scale;
    const boxH = item.size?.y ?? TILE_SIZE * 0.2 * scale;
    const boxX = screenX + (item.offset?.x ?? 0);
    const boxY = screenY + (item.offset?.y ?? boxH / 2);

    const hitbox = new Rectangle(boxX, boxY, boxW, boxH);

    staticObstacles.push(hitbox);
    foliageContainer.addChild(bushSprite);
  });

  return foliageContainer;
};
