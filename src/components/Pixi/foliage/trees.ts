import { createAnimatedSprite } from "../../../utils/pixi/index.js";
import { Viewport } from "pixi-viewport";
import { WORLD_SCALE } from "../config.js";

const scaleFactor = WORLD_SCALE * 32;

const animatedTrees = [
  { x: 0 * scaleFactor, y: 0 * scaleFactor },
  { x: 1 * scaleFactor, y: 1 * scaleFactor },
  { x: 3 * scaleFactor, y: 0 * scaleFactor },
  { x: 3 * scaleFactor, y: 2 * scaleFactor },
  { x: 6 * scaleFactor, y: 1 * scaleFactor },
  { x: 8 * scaleFactor, y: 0 * scaleFactor },
  { x: 8 * scaleFactor, y: 2 * scaleFactor },
  { x: 12 * scaleFactor, y: 1 * scaleFactor },
  { x: 15 * scaleFactor, y: 0 * scaleFactor },
  { x: 13.5 * scaleFactor, y: -0.5 * scaleFactor },
  // 2nd row of trees
  { x: 0, y: 6 * scaleFactor },
  { x: 0, y: 8 * scaleFactor },
  { x: 2 * scaleFactor, y: 7 * scaleFactor },
  { x: 4 * scaleFactor, y: 5 * scaleFactor },
  { x: 7 * scaleFactor, y: 6 * scaleFactor },
  { x: 5 * scaleFactor, y: 8 * scaleFactor },
  { x: 12 * scaleFactor, y: 5.5 * scaleFactor },
  { x: 15 * scaleFactor, y: 6 * scaleFactor },
  { x: 15 * scaleFactor, y: 8 * scaleFactor },
  //   3rd row of trees
  { x: 9 * scaleFactor, y: 15 * scaleFactor },
  { x: 11 * scaleFactor, y: 15 * scaleFactor },
  { x: 13 * scaleFactor, y: 15 * scaleFactor },
  { x: 15 * scaleFactor, y: 15 * scaleFactor },
];

export const populateWithTrees = (viewport: Viewport) => {
  animatedTrees.forEach((tree) => {
    const animationSpeed = Math.random() * 0.1 + 0.05; // Random speed between 0.05 and 0.15
    const animatedTree = createAnimatedSprite(
      "treeGreen",
      16,
      64,
      64,
      tree.x,
      tree.y,
      3,
      animationSpeed
    );

    viewport.addChild(animatedTree);
    animatedTree.play();
  });
};
