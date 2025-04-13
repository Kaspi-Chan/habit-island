import {
  AnimatedSprite,
  Assets,
  TextureSource,
  Container,
  Rectangle,
  Texture,
} from "pixi.js";
import { createFrames } from "../../../utils/pixi/index.js";

export interface BunnyInitOptions {
  x?: number;
  y?: number;
  scale?: { x: number; y: number };
  /**
   * The anchor to be applied to the AnimatedSprite.
   * Note: Containers don’t have an anchor property, so we store it
   * and apply it to the AnimatedSprite when created.
   */
  anchor?: { x: number; y: number };
}

export class Bunny extends Container {
  private animations: Record<string, Texture[]> = {};
  private currentAnim: AnimatedSprite | null = null;
  private currentAnimName: string | null = null;
  // Stored anchor value to apply to AnimatedSprite(s)
  private _anchor?: { x: number; y: number };

  constructor() {
    super();
  }

  /**
   * Initializes the Bunny container and stores options like position, scale and anchor.
   * @param options BunnyInitOptions – position, scale, and anchor settings.
   */
  public init(options: BunnyInitOptions): void {
    if (options.x !== undefined) {
      this.x = options.x;
    }
    if (options.y !== undefined) {
      this.y = options.y;
    }
    if (options.scale) {
      this.scale.set(options.scale.x, options.scale.y);
    }
    if (options.anchor) {
      // Save the anchor for later use on AnimatedSprite
      this._anchor = options.anchor;
      // If an animation is already playing, set its anchor:
      if (this.currentAnim) {
        this.currentAnim.anchor.set(options.anchor.x, options.anchor.y);
      }
    }
  }

  /**
   * Asynchronously loads a PNG asset and defines an animation from it.
   */
  async defineAnimationFromURL(
    name: string,
    url: string,
    startX: number,
    startY: number,
    totalFrames: number,
    frameWidth: number,
    frameHeight: number
  ): Promise<void> {
    const source: TextureSource = await Assets.load(url);
    const frames = createFrames(
      source,
      frameWidth,
      frameHeight,
      startX,
      startY,
      totalFrames
    );
    this.animations[name] = frames;
  }

  /**
   * Plays the animation defined by the given name.
   *
   * @param name - The name of the animation to play.
   * @param animationSpeed - Optional speed for the animation (default 0.2).
   */
  play(name: string, animationSpeed = 0.2): void {
    const frames = this.animations[name];
    if (!frames) {
      console.warn(`Animation '${name}' not found.`);
      return;
    }

    if (this.currentAnim) {
      this.removeChild(this.currentAnim);
      this.currentAnim.destroy();
    }

    this.currentAnim = new AnimatedSprite(frames);
    this.currentAnim.animationSpeed = animationSpeed;
    this.currentAnim.play();
    this.addChild(this.currentAnim);
    this.currentAnimName = name;

    if (this._anchor) {
      this.currentAnim.anchor.set(this._anchor.x, this._anchor.y);
    }
  }

  toggleAnimation(): void {
    if (this.currentAnimName === "jump") {
      this.play("sleep");
    } else {
      this.play("jump");
    }
  }

  /**
   * Enables pointer interactions on the Bunny.
   * When the Bunny is clicked, the animation specified by `name` is played.
   *
   * @param name - The animation name to trigger on click.
   */
  clickToToggle(): void {
    this.eventMode = "static";
    this.cursor = "pointer";
    this.on("pointerdown", () => this.toggleAnimation());
  }
}
