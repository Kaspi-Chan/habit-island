import { Viewport } from "pixi-viewport";
import {
  Application,
  Sprite,
  TextureSource,
  Assets,
  Graphics,
  Rectangle,
  Container,
} from "pixi.js";
import {
  BOUNDS,
  TILE_SIZE,
  WORLD_HEIGHT,
  WORLD_SCALE,
  WORLD_WIDTH,
} from "./config";

export let viewport: Viewport | null = null;
export const staticObstacles: Rectangle[] = [];

export const init = async (container: HTMLElement) => {
  const app = new Application();
  TextureSource.defaultOptions.scaleMode = "nearest";

  // init app
  await app.init({
    resizeTo: container,
    backgroundColor: "#000333",
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  // load assets
  await preload();

  // add viewport background
  viewport = setupViewport(app, container);

  // debug grid
  const debugGrid = drawGrid();
  const debugGridSmall = drawGrid(16);
  debugGrid.stroke({ width: 1, color: 0xcccccc });
  debugGridSmall.stroke({ width: 1, color: 0xff0000 });
  // app.stage.addChild(debugGridSmall);
  setupBounds();
  // app.stage.addChild(debugGrid);

  return { app, viewport };
};

const preload = async () => {
  const assets = [
    { alias: "background", src: "tiles/bg-1.png" },
    { alias: "treeGreen", src: "trees/AnimatedTreeCoolColor.png" },
    { alias: "rock", src: "others/rock.png" },
    { alias: "big-log", src: "others/big-log.png" },
    { alias: "water-anim", src: "tiles/water-anim.png" },
    // Bushes
    { alias: "bush", src: "others/bush.png" },
    { alias: "bush-small", src: "others/bush-small.png" },
    // Bunny
    { alias: "bunny-idle", src: "animals/bunny/Idle.png" },
    { alias: "bunny-jump", src: "animals/bunny/jump.png" },
    { alias: "bunny-lick", src: "animals/bunny/Liking.png" },
    { alias: "bunny-run", src: "animals/bunny/run.png" },
    { alias: "bunny-sleep", src: "animals/bunny/sleep.png" },
    { alias: "bunny-play", src: "animals/bunny/play.png" },
    // Cappy
    { alias: "cappy-idle", src: "animals/capybara/idle.png" },
    { alias: "cappy-sleep", src: "animals/capybara/sleep.png" },
    { alias: "cappy-walk", src: "animals/capybara/walk.png" },
    { alias: "cappy-happy", src: "animals/capybara/happy.png" },
    // parrot
    { alias: "parrot-idle", src: "animals/parrot/idle.png" },
    { alias: "parrot-sleep", src: "animals/parrot/sleep.png" },
    { alias: "parrot-walk", src: "animals/parrot/walk.png" },
    { alias: "parrot-sit", src: "animals/parrot/sit.png" },
    { alias: "parrot-fly", src: "animals/parrot/fly.png" },
    // fox
    { alias: "fox-idle", src: "animals/fox/idle.png" },
    { alias: "fox-jump", src: "animals/fox/jump.png" },
    { alias: "fox-sit", src: "animals/fox/sit.png" },
    { alias: "fox-sleep", src: "animals/fox/sleep.png" },
    { alias: "fox-walk", src: "animals/fox/walk.png" },
    // cat
    { alias: "cat-idle", src: "animals/cat/idle.png" },
    { alias: "cat-jump", src: "animals/cat/jump.png" },
    { alias: "cat-sit", src: "animals/cat/sit.png" },
    { alias: "cat-sleep", src: "animals/cat/sleep.png" },
    { alias: "cat-run", src: "animals/cat/run.png" },
    // turtle
    { alias: "turtle-hide", src: "animals/turtle/hide.png" },
    { alias: "turtle-idle", src: "animals/turtle/idle.png" },
    { alias: "turtle-jump", src: "animals/turtle/jump.png" },
    { alias: "turtle-lie", src: "animals/turtle/lie.png" },
    { alias: "turtle-sit", src: "animals/turtle/sit.png" },
    { alias: "turtle-sleep", src: "animals/turtle/sleep.png" },
    { alias: "turtle-walk", src: "animals/turtle/walk.png" },
  ];

  await Assets.load(assets);
};

const setupViewport = (app: Application, container: HTMLElement) => {
  const tilemapSprite = Sprite.from("background");
  tilemapSprite.anchor.set(0);
  tilemapSprite.position.set(0);
  tilemapSprite.scale.set(WORLD_SCALE);

  const viewport = new Viewport({
    screenWidth: container!.clientWidth,
    screenHeight: container!.clientHeight,
    worldWidth: WORLD_WIDTH,
    worldHeight: WORLD_HEIGHT,
    events: app.renderer.events,
  });

  viewport.addChild(tilemapSprite);

  viewport.clampZoom({
    minWidth: viewport.worldWidth / 3,
    maxWidth: viewport.worldWidth,
    minHeight: viewport.worldHeight / 3,
    maxHeight: viewport.worldHeight,
  });

  app.stage.addChild(viewport);
  // viewport.sortableChildren = true;
  viewport.drag().pinch().wheel().decelerate();
  viewport.clamp({ direction: "all" });

  return viewport;
};

const setupBounds = () => {
  BOUNDS.forEach((boundary) => {
    staticObstacles.push(
      new Rectangle(
        boundary.x * TILE_SIZE,
        boundary.y * TILE_SIZE,
        boundary.size.x,
        boundary.size.y
      )
    );
  });
};
function drawGrid(size: number = 32) {
  const grid = new Graphics();
  grid.stroke({ color: 0xffffff, pixelLine: true, width: 1 });

  const width = WORLD_WIDTH;
  const height = WORLD_HEIGHT;

  // vertical lines
  for (let x = 0; x <= width; x += size * WORLD_SCALE) {
    grid.moveTo(x, 0).lineTo(x, height);
  }

  // horizontal lines
  for (let y = 0; y <= height; y += size * WORLD_SCALE) {
    grid.moveTo(0, y).lineTo(width, y);
  }

  return grid;
}
