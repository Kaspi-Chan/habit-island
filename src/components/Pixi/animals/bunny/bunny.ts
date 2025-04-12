import {
  AnimatedSprite,
  Application,
  Assets,
  Rectangle,
  Spritesheet,
  Texture,
} from "pixi.js";
import { createFrames } from "../../../../utils/pixi/index.js";
import { Viewport } from "pixi-viewport";

// const animations = {
//   jump: createFrames(baseTexture, 32, 32, 0, 0, 12),
//   sleep: createFrames(baseTexture, 32, 32, 0, 32, 6), // assuming sleep is on second row
// };

export const addBunny = async (viewport: Viewport) => {
  const texture = Assets.get("bunnyJump");

  const frameWidth = 32; // replace this with your actual frame width
  const frameHeight = 32; // or height of each frame if needed
  const totalFrames = 11; // count of frames in your strip

  const frames = [];

  for (let i = 0; i < totalFrames; i++) {
    const frame = new Texture({
      source: texture.source,
      frame: new Rectangle(i * frameWidth, 0, frameWidth, frameHeight),
    });
    frames.push(frame);
  }

  const animatedSprite = new AnimatedSprite(frames);
  animatedSprite.animationSpeed = 0.25;
  animatedSprite.scale.set(3, 3);
  animatedSprite.position.set(100, 500);
  animatedSprite.anchor.set(0.5);

  animatedSprite.play();
  viewport.addChild(animatedSprite);

  return animatedSprite;
};

export const animateBunny = (app: Application, bunny: AnimatedSprite) => {
  if (bunny.x >= app.screen.width) {
    bunny.x = -bunny.width;
  }

  bunny.x += 2;
};
