import { AnimatedSprite, Assets } from "pixi.js";
import { createFrames } from "../../../../utils/pixi/index.js";
import { Viewport } from "pixi-viewport";

const scaleFactor = 3 * 32;

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

// if needed set it up as a util function and pass x,y, speed, width, height, totalFrames
const createAnimatedTreeSprite = (
  viewport: Viewport,
  x: number,
  y: number,
  speed: number
) => {
  const texture = Assets.get("treeGreen");

  const frameWidth = 64; // replace this with your actual frame width
  const frameHeight = 64; // or height of each frame if needed
  const totalFrames = 16; // count of frames in your strip

  const frames = createFrames(
    texture.source,
    frameWidth,
    frameHeight,
    0,
    0,
    totalFrames
  );

  const animatedSprite = new AnimatedSprite(frames);
  animatedSprite.animationSpeed = speed;
  animatedSprite.scale.set(3, 3);
  animatedSprite.position.set(x, y);
  animatedSprite.anchor.set(0.5);

  animatedSprite.play();
  viewport.addChild(animatedSprite);

  return animatedSprite;
};

export const populateWithTrees = (viewport: Viewport) => {
  animatedTrees.forEach((tree) => {
    const animationSpeed = Math.random() * 0.2 + 0.05; // Random speed between 0.05 and 0.25
    createAnimatedTreeSprite(viewport, tree.x, tree.y, animationSpeed);
  });
};
