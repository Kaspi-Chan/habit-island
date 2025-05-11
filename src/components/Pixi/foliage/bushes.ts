import { Assets, Container, Rectangle, Sprite } from "pixi.js";
import { TILE_SIZE } from "../config";
import { Viewport } from "pixi-viewport";
import { staticObstacles } from "../setup";

const foliage = [
  // { x: 1, y: 0.5, scale: 1.6, alias: "bush" },
  // { x: 1, y: 1.5, scale: 1.6, alias: "bush" },
  // { x: 2.5, y: 0, scale: 1.6, alias: "bush" },
  { x: 4, y: 1.5, scale: 1.6, alias: "bush" },
  { x: 8.5, y: 1, scale: 1.6, alias: "bush" },
  { x: 11.5, y: 1, scale: 1.6, alias: "bush" },
  { x: 14, y: 1, scale: 1.6, alias: "bush" },
  // 2nd row
  { x: 2, y: 5.5, scale: 1.6, alias: "bush" },
  { x: 6, y: 5.5, scale: 1.6, alias: "bush" },
  // { x: 7, y: 6, scale: 1.6, alias: "bush" },
  { x: 11.5, y: 6.5, scale: 1.6, alias: "bush" },
  { x: 12, y: 7, scale: 1.6, alias: "bush" },
  // big bushes
  { x: 6.1, y: 0.65, scale: 3, alias: "bush" },
  // 2nd row
  { x: 3.1, y: 7.15, scale: 3, alias: "bush" },
  { x: 1.6, y: 8.15, scale: 3, alias: "bush" },
  { x: 13.1, y: 5.65, scale: 3, alias: "bush" },
  { x: 13.1, y: 7.15, scale: 3, alias: "bush" },
  // 3rd row
  { x: 8.57, y: 12.65, scale: 3, alias: "bush" },
  { x: 11.1, y: 12.65, scale: 3, alias: "bush" },
  { x: 12.6, y: 12.15, scale: 3, alias: "bush" },
  { x: 13.6, y: 13.15, scale: 3, alias: "bush" },
];

export const loadBushes = (viewport: Viewport) => {
  foliage.forEach((item) => {
    const { x, y, scale, alias } = item;
    const texture = Assets.get(alias);
    const bushSprite = new Sprite(texture);

    // bushSprite.anchor.set(0.5);
    const screenX = x * TILE_SIZE;
    const screenY = y * TILE_SIZE;
    const sizeX = TILE_SIZE * 0.3 * scale;
    const sizeY = TILE_SIZE * 0.2 * scale;

    bushSprite.position.set(screenX, screenY);
    bushSprite.scale.set(scale);
    bushSprite.zIndex = 50;

    const hitbox = new Rectangle(screenX, screenY + sizeY / 2, sizeX, sizeY);

    staticObstacles.push(hitbox);
    viewport.addChild(bushSprite);
  });
};
