import { Viewport } from "pixi-viewport";
import { Application, Sprite, TextureSource, Assets } from "pixi.js";
import { WORLD_HEIGHT, WORLD_SCALE, WORLD_WIDTH } from "./config";

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
  const viewport = setupViewport(app, container);

  return { app, viewport };
};

const preload = async () => {
  const assets = [
    // { alias: "background", src: "tiles/island-bg.png" },
    // { alias: "backgroundNoTrees", src: "tiles/bg-no-trees.png" },
    { alias: "backgroundNoTrees2", src: "tiles/bg-no-trees2.png" },
    { alias: "tree", src: "trees/Autumn.png" },
    { alias: "treeGreen", src: "trees/AnimatedTreeCoolColor.png" },
    // Parrot
    { alias: "parrot", src: "animals/ParrotFly.png" },
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
  ];

  await Assets.load(assets);
};

const setupViewport = (app: Application, container: HTMLElement) => {
  const tilemapSprite = Sprite.from("backgroundNoTrees2");
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
  viewport.drag().pinch().wheel().decelerate();
  viewport.clamp({ direction: "all" });

  return viewport;
};
