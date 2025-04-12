import { Rectangle, Texture, TextureSource } from "pixi.js";

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
