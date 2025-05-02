import {
  AnimatedSprite,
  Assets,
  Rectangle,
  Texture,
  TextureSource,
} from "pixi.js";

export function createFrames(
  textureSource: TextureSource,
  frameWidth: number,
  frameHeight: number,
  startX: number,
  startY: number,
  totalFrames: number
): Texture[] {
  const frames = [];
  for (let i = 0; i < totalFrames; i++) {
    const frame = new Texture({
      source: textureSource,
      frame: new Rectangle(
        startX + i * frameWidth,
        startY,
        frameWidth,
        frameHeight
      ),
    });
    frames.push(frame);
  }
  return frames;
}

export const createAnimatedSprite = (
  source: string,
  totalFrames: number,
  frameWidth: number,
  frameHeight: number,
  x: number,
  y: number,
  scale: number,
  speed: number
) => {
  const texture = Assets.get(source);
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
  animatedSprite.scale.set(scale);
  animatedSprite.position.set(x, y);
  animatedSprite.anchor.set(0.5);

  return animatedSprite;
};
