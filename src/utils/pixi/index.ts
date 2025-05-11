import {
  AnimatedSprite,
  Assets,
  Container,
  Graphics,
  Point,
  Rectangle,
  Sprite,
  Texture,
  TextureSource,
} from "pixi.js";
import { SimpleRectangle } from "../../types/pixi";

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

export function debugHitArea(
  rect: Rectangle | any,
  color = 0xff0000,
  alpha = 0.3
) {
  let { x, y, width, height } = rect;

  if (rect instanceof Rectangle) {
    x = rect.x;
    y = rect.y;
    width = rect.width;
    height = rect.height;
  }

  const g = new Graphics();
  g.stroke({ width: 1, color: 0x000000 });
  g.fill({ color, alpha });
  g.rect(x, y, width, height);
  g.fill();

  return g;
}

export function getAbsoluteCords(localRect: Rectangle, container: Container) {
  return {
    x: localRect.x + container.x,
    y: localRect.y + container.y,
    width: localRect.width,
    height: localRect.height,
  };
}

export function isColliding(
  a: Rectangle | SimpleRectangle,
  b: Rectangle | SimpleRectangle
) {
  return !(
    a.x + a.width < b.x ||
    a.x > b.x + b.width ||
    a.y + a.height < b.y ||
    a.y > b.y + b.height
  );
}

export function rectangleContains(rectangle: SimpleRectangle, point: Point) {
  return (
    point.x >= rectangle.x &&
    point.x <= rectangle.x + rectangle.width &&
    point.y >= rectangle.y &&
    point.y <= rectangle.y + rectangle.height
  );
}
