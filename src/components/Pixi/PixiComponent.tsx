import { onMount, onCleanup, createSignal } from "solid-js";
import {
  Application,
  Graphics,
  Text,
  Sprite,
  Assets,
  Spritesheet,
  AnimatedSprite,
  TextureSource,
  Ticker,
  Container,
  Point,
  Texture,
  Rectangle,
} from "pixi.js";
import { Viewport } from "pixi-viewport";
import { initDevtools } from "@pixi/devtools";
import { populateWithTrees } from "./foliage/trees.js";
import { init } from "./setup.js";
import { Bunny } from "./animals/Bunny/Bunny.js";
import { Capybara } from "./animals/Capybara/Capybara.js";
import { Parrot } from "./animals/Parrot/Parrot.js";
import { Fox } from "./animals/Fox/Fox.js";

function PixiComponent() {
  let container; // Reference to the container div

  onMount(() => {
    (async () => {
      const { app, viewport } = await init(container!);

      const cappy1 = new Capybara();
      const cappy2 = new Capybara();
      const cappy3 = new Capybara();
      viewport.addChild(cappy1);
      viewport.addChild(cappy2);
      viewport.addChild(cappy3);

      const bunny1 = new Bunny();
      const bunny2 = new Bunny();
      const bunny3 = new Bunny();
      const bunny4 = new Bunny();
      const bunny5 = new Bunny();
      viewport.addChild(bunny1);
      viewport.addChild(bunny2);
      viewport.addChild(bunny3);
      viewport.addChild(bunny4);
      viewport.addChild(bunny5);

      const fox1 = new Fox();
      const fox2 = new Fox();
      const fox3 = new Fox();
      viewport.addChild(fox1);
      viewport.addChild(fox2);
      viewport.addChild(fox3);

      const parrot1 = new Parrot();
      const parrot2 = new Parrot();
      const parrot3 = new Parrot();
      viewport.addChild(parrot1);
      viewport.addChild(parrot2);
      viewport.addChild(parrot3);

      populateWithTrees(viewport);

      // export viewport
      initDevtools({ app });
      container!.appendChild(app.canvas);
    })();
  });

  return (
    <div class="w-full h-full max-w-[1440px] mx-auto" ref={container}></div>
  );
}

export default PixiComponent;
