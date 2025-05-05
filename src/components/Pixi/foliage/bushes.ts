import { Assets, Sprite } from "pixi.js";
import { TILE_SIZE } from "../config";
import { Viewport } from "pixi-viewport";

const foliage = [
  { x: 1, y: 0.5, scale: 1.6, alias: "bush" },
  { x: 1, y: 1.5, scale: 1.6, alias: "bush" },
  { x: 2.5, y: 0, scale: 1.6, alias: "bush" },
  { x: 4, y: 1.5, scale: 1.6, alias: "bush" },
  { x: 8.5, y: 1, scale: 1.6, alias: "bush" },
  { x: 11.5, y: 1, scale: 1.6, alias: "bush" },
  { x: 14, y: 1, scale: 1.6, alias: "bush" },
  // BIG BUSHES
  { x: 6.1, y: 0.65, scale: 3, alias: "bush" },
];

export const loadBushes = (viewport: Viewport) => {
  foliage.forEach((item) => {
    const { x, y, scale, alias } = item;
    const texture = Assets.get(alias);
    const bushSprite = new Sprite(texture);

    // bushSprite.anchor.set(0.5);
    bushSprite.position.set(x * TILE_SIZE, y * TILE_SIZE);
    bushSprite.scale.set(scale);
    bushSprite.zIndex = 50; // Set zIndex to ensure it appears above the tilemap

    viewport.addChild(bushSprite);
  });
};
