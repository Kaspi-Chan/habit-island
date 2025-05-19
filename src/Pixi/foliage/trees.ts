import { createAnimatedSprite, debugHitArea } from "../../utils/pixi/index.js";
import { COLS, ROWS, TILE_SIZE } from "../config.js";
import {
  AnimatedSprite,
  Container,
  Graphics,
  Rectangle,
  Sprite,
} from "pixi.js";
import { staticObstacles } from "../setup.js";

const animatedTrees = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
  { x: 3, y: 0 },
  { x: 3, y: 2 },
  { x: 6, y: 1 },
  { x: 8, y: 0 },
  { x: 8, y: 2 },
  { x: 12, y: 0.7 },
  { x: 15, y: 0 },
  { x: 13.5, y: -0.5 },
  // 2nd row of trees
  { x: 0, y: 6 },
  { x: 0, y: 8 },
  { x: 2, y: 7 },
  { x: 4, y: 5 },
  { x: 7, y: 6 },
  { x: 5, y: 8 },
  { x: 12, y: 5.5 },
  { x: 15, y: 6 },
  { x: 15, y: 8 },
  //   3rd row of trees
  { x: 9, y: 15 },
  { x: 11, y: 15 },
  { x: 13, y: 15 },
  { x: 15, y: 15 },
];

export const populateWithTrees = () => {
  const treeContainer = new Container();
  treeContainer.zIndex = 60;

  animatedTrees.forEach((tree) => {
    const screenX = tree.x * TILE_SIZE;
    const screenY = tree.y * TILE_SIZE;

    const animationSpeed = Math.random() * 0.1 + 0.05; // Random speed between 0.05 and 0.15
    const animatedTree = createAnimatedSprite(
      "treeGreen",
      16,
      64,
      64,
      screenX,
      screenY,
      3,
      animationSpeed
    );

    const hitbox = new Rectangle(
      screenX - TILE_SIZE * 0.25,
      screenY + TILE_SIZE * 0.5,
      TILE_SIZE * 0.5,
      TILE_SIZE * 0.5
    );

    staticObstacles.push(hitbox);

    // animatedTree
    treeContainer.addChild(animatedTree);
    animatedTree.play();
  });

  return treeContainer;
};
