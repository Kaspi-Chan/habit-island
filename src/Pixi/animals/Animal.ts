import {
  Assets,
  AnimatedSprite,
  Container,
  Texture,
  Point,
  Rectangle,
  Ticker,
  Graphics,
} from "pixi.js";
import {
  createFrames,
  debugHitArea,
  getAbsoluteCords,
  isColliding,
  rectangleContains,
} from "../../utils/pixi";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../config";
import { staticObstacles, viewport } from "../setup";
import { StateMachine } from "../StateMachine";
import { clamp, isWithinRange } from "../../utils/utils";
import { SimpleRectangle } from "../../types/pixi";

interface AnimationConfig {
  assetKey: string;
  frameCount: number;
  animationSpeed?: number;
  scale?: number;
}

interface AnimalConfig {
  width: number;
  height: number;
  scale: number;
  animations: Record<string, AnimationConfig>;
}

export interface HitBoxConfig {
  w?: number;
  h?: number;
  offsetX?: number;
  offsetY?: number;
}

export type AnimalState = "idle" | "sleep";
const dynamicObstacles: Animal<any>[] = [];

export abstract class Animal<
  State extends string = AnimalState
> extends Container {
  public animations: Record<string, AnimatedSprite> = {};
  private static framesCache: Record<string, Texture[]> = {};
  static hitBoxConfig: HitBoxConfig = {
    w: 1,
    h: 1,
    offsetX: 0,
    offsetY: 0,
  };
  private hitbox = new Rectangle(0, 0, 0, 0);
  private currentState!: State;
  protected target: Point | null = null;
  protected speed = 100; // pixels per second
  protected fsm!: StateMachine<State>;
  protected ignoreCollision = false;
  private debugLayer = new Graphics();

  constructor(cfg: AnimalConfig) {
    super();
    this.init(cfg);
    this.createHitBox();
    // set random position
    const { x, y } = this.pickStartingPoint();
    this.position.set(x, y);
    // debug points
    viewport!.addChild(this.debugLayer);
    this.debugLayer.zIndex = 1000; // above everything else
  }

  /**
   * Creates the animated sprites and stores them in the animations object.
   * When called for the first time also slices the png atlas
   * @param cfg The sprites configurations
   */
  private init(cfg: AnimalConfig) {
    const animationCache = (this.constructor as typeof Animal).framesCache;
    for (const [state, animConfig] of Object.entries(cfg.animations)) {
      const key = animConfig.assetKey;

      if (!animationCache[key]) {
        const texture = Assets.get(animConfig.assetKey);
        animationCache[key] = createFrames(
          texture,
          cfg.width,
          cfg.height,
          0,
          0,
          animConfig.frameCount
        );
      }

      const animation = new AnimatedSprite(animationCache[key]);
      animation.animationSpeed = animConfig.animationSpeed || 1;
      animation.scale.set(cfg.scale);
      animation.anchor.set(0.5);
      animation.visible = false;

      this.animations[state] = animation;
      this.addChild(this.animations[state]);
    }

    // Init animation
    this.currentState = "idle" as State;
    this.animations[this.currentState].visible = true;
    this.animations[this.currentState].play();
  }

  protected abstract initStates(): void;

  private pickStartingPoint() {
    let x = 0;
    let y = 0;

    do {
      x = Math.random() * WORLD_WIDTH;
      y = Math.random() * WORLD_HEIGHT;
    } while (!this.isValidPoint(x, y));

    return { x, y };
  }

  private pickRandomPoint() {
    let x = 0,
      y = 0,
      dx = 0;

    do {
      x = Math.random() * WORLD_WIDTH;
      y = Math.random() * WORLD_HEIGHT;
      dx = Math.abs(x - this.x);
    } while (!this.isValidPoint(x, y) || dx < 200);

    return new Point(x, y);
  }

  private isValidPoint(px: number, py: number): boolean {
    // prettier-ignore
    const oldX = this.x, oldY = this.y;
    this.x = px;
    this.y = py;

    const worldHit = getAbsoluteCords(this.hitbox, this);

    this.x = oldX;
    this.y = oldY;

    return (
      !staticObstacles.some((r) => isColliding(worldHit, r)) &&
      !dynamicObstacles.some((r) => {
        const otherWorldHit = getAbsoluteCords(r.hitbox, r);
        return isColliding(worldHit, otherWorldHit);
      })
    );
  }

  public play(state: State) {
    if (state === this.currentState) return;
    const old = this.animations[this.currentState];
    old.stop();
    old.visible = false;

    const next = this.animations[state];
    if (!next) {
      console.warn(`No animation "${state}" on`, this);
      return;
    }
    next.visible = true;
    next.play();
    this.currentState = state;
  }

  protected updateStackingOrder(value: number) {
    this.zIndex = value;
    viewport!.sortChildren();
  }

  protected onObstacleHit() {
    // this.debugLayer.clear();
    this.pickNewTarget(this.speed);
  }

  protected startMoving(speed: number) {
    this.pickNewTarget(speed);
    Ticker.shared.add(this.moveOnTick, this);
  }

  protected stopMoving() {
    this.target = null;
    Ticker.shared.remove(this.moveOnTick, this);
  }

  private pickNewTarget(speed: number) {
    this.target = this.pickRandomPoint();

    this.speed = speed;
    this.scale.x = this.x >= this.target!.x ? -1 : 1; // face direction

    // debug
    // this.drawDebugPath();
  }

  private moveOnTick() {
    if (!this.target) return;

    let { moveX, moveY, step, currX, currY } = this.computeMoveDeltas();
    // move
    this.x += moveX;
    this.y += moveY;

    // get hitbox in world coordinates
    let myHitbox = getAbsoluteCords(this.hitbox, this);

    // snap to target if close enough
    if (rectangleContains(myHitbox, this.target)) {
      return this.onTargetReached();
    }

    if (this.ignoreCollision) return;

    // handle static collision
    for (const r of staticObstacles) {
      if (!isColliding(myHitbox, r)) continue;
      // undo movement
      this.x = currX;
      this.y = currY;

      const xIsInRange = isWithinRange(this.x, this.target.x, 50 + this.width);
      const yIsInRange = isWithinRange(this.y, this.target.y, 50 + this.height);

      if (xIsInRange && yIsInRange) {
        return this.onTargetReached();
      }

      if (xIsInRange) {
        const by = this.x > this.target.x ? -50 : 50;
        if (!this.isOffsetReachable("x", by)) {
          console.log("not reachable papi: ", this, this.target);
          this.onTargetReached();
        }
      } else if (yIsInRange) {
        const by = this.y > this.target.y ? -50 : 50;
        if (!this.isOffsetReachable("y", by)) {
          console.log("not reachable papi: ", this, this.target);
          this.onTargetReached();
        }
      }

      // see by which axis we collide first
      const verticalFirst = Math.abs(moveX) > Math.abs(moveY);
      if (verticalFirst) {
        moveY = this.checkCollisionByAxis("y", moveY, r);
        moveX = this.checkCollisionByAxis("x", moveX, r);
      } else {
        moveX = this.checkCollisionByAxis("x", moveX, r);
        moveY = this.checkCollisionByAxis("y", moveY, r);
      }

      // Movement resolution
      if (moveX === 0 && moveY === 0) {
        this.x = currX;
        this.y = currY;
        return this.pickNewTarget(this.speed);
      }

      // boostFactor between 0 (no boost) and 1 (full boost)
      const boostFactor = 0.25;
      if (moveX === 0) {
        const orig = Math.abs(moveY);
        const boosted = orig + (step - orig) * boostFactor;
        moveY = Math.sign(moveY) * boosted;
      } else if (moveY === 0) {
        const orig = Math.abs(moveX);
        const boosted = orig + (step - orig) * boostFactor;
        moveX = Math.sign(moveX) * boosted;
      }

      this.x += moveX;
      this.y += moveY;
    }
  }

  private isOffsetReachable(coord: "x" | "y", by: number): boolean {
    const bound = coord === "x" ? WORLD_WIDTH : WORLD_HEIGHT;
    const old = this.target![coord];
    const next = clamp(old + by, 0, bound);

    if (next === old) {
      return false;
    }

    this.target![coord] = next;
    return true;
  }

  // prettier-ignore
  checkCollisionByAxis(axis: "x" | "y",move: number,collisionRect: Rectangle | SimpleRectangle) {
    this[axis] += move;
    let myHitbox = getAbsoluteCords(this.hitbox, this);
    if (isColliding(myHitbox, collisionRect)) {
      this[axis] -= move; // undo horizontal movement
      move = 0; // kill X movement
    }

    return move;
  }

  private computeMoveDeltas() {
    // prettier-ignore
    const secondsElapsed = (Ticker.shared.elapsedMS / 1000) * Ticker.shared.speed;
    const step = this.speed * secondsElapsed;
    const deltaX = this.target!.x - this.x;
    const deltaY = this.target!.y - this.y;
    const dist = Math.hypot(deltaX, deltaY);

    // save current position
    const currX = this.x;
    const currY = this.y;

    // get next position
    let moveX = (deltaX / dist) * step;
    let moveY = (deltaY / dist) * step;

    return {
      moveX,
      moveY,
      step,
      currX,
      currY,
    };
  }

  private animalIntersects(obstacle: Animal): boolean {
    const a = getAbsoluteCords(this.hitbox, this);
    const b = getAbsoluteCords(obstacle.hitbox, obstacle);

    return !(
      a.x + a.width <= b.x ||
      a.x >= b.x + b.width ||
      a.y + a.height <= b.y ||
      a.y >= b.y + b.height
    );
  }

  protected onTargetReached() {
    // this.debugLayer.clear();
    this.fsm.goNext();
  }

  private createHitBox() {
    const {
      w = 1,
      h = 1,
      offsetX = 0,
      offsetY = 0,
    } = (this.constructor as typeof Animal).hitBoxConfig;

    const width = this.width * w;
    const height = this.height * h;

    const x = -width / 2 + offsetX;
    const y = -height / 2 + offsetY;

    this.hitbox = new Rectangle(x, y, width, height);
    dynamicObstacles.push(this);

    this.addChild(debugHitArea(this.hitbox, 0x00ff00, 0.3)!);
  }

  private drawDebugPath() {
    const g = this.debugLayer;
    g.clear();

    // if (this.path.length === 0) return;

    // draw each waypoint as a small white dot
    // for (const pt of this.path) {
    //   g.circle(pt.x, pt.y, 4);
    //   g.fill(0xffffff);
    // }

    // mark start (first) in green
    const start = this.position;
    g.circle(start.x, start.y, 6);
    g.fill(0x00ff00);

    // mark end (last) in red
    const end = this.target;
    g.circle(end!.x, end!.y, 6);
    g.fill(0xff0000);
  }
}
