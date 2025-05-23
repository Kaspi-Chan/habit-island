import { onMount, onCleanup, createSignal } from "solid-js";
import { initDevtools } from "@pixi/devtools";
import { populateWithTrees } from "../Pixi/foliage/trees.js";
import { init, staticObstacles } from "../Pixi/setup.js";
import { debugHitArea } from "../utils/pixi/index.js";
import { populateWithFoliage } from "../Pixi/foliage/foliage.js";
import { Capybara } from "../Pixi/animals/Capybara/Capybara.js";
import { Bunny } from "../Pixi/animals/Bunny/Bunny.js";
import { Fox } from "../Pixi/animals/Fox/Fox.js";
import { Parrot } from "../Pixi/animals/Parrot/Parrot.js";
import { Cat } from "../Pixi/animals/Cat/Cat.js";
import { Turtle } from "../Pixi/animals/Turtle/Turtle.js";
import { addWaterTiles } from "../Pixi/foliage/water.js";

function Island() {
  let container; // Reference to the container div

  onMount(() => {
    (async () => {
      const { app, viewport } = await init(container!);
      viewport.addChild(populateWithTrees());
      viewport.addChild(populateWithFoliage());
      viewport.addChild(addWaterTiles());

      staticObstacles.forEach((obsticle) =>
        viewport.addChild(debugHitArea(obsticle, 0x00ff00, 0.3)!)
      );

      const cappy1 = new Capybara();
      const cappy2 = new Capybara();
      // const cappy3 = new Capybara();
      viewport.addChild(cappy1);
      viewport.addChild(cappy2);
      // viewport.addChild(cappy3);

      const bunny1 = new Bunny();
      const bunny2 = new Bunny();
      // const bunny3 = new Bunny();
      // const bunny4 = new Bunny();
      // const bunny5 = new Bunny();
      viewport.addChild(bunny1);
      viewport.addChild(bunny2);
      // viewport.addChild(bunny3);
      // viewport.addChild(bunny4);
      // viewport.addChild(bunny5);

      const fox1 = new Fox();
      const fox2 = new Fox();
      // const fox3 = new Fox();
      viewport.addChild(fox1);
      viewport.addChild(fox2);
      // viewport.addChild(fox3);

      const parrot1 = new Parrot();
      const parrot2 = new Parrot();
      // const parrot3 = new Parrot();
      viewport.addChild(parrot1);
      viewport.addChild(parrot2);
      // viewport.addChild(parrot3);

      const cat = new Cat();
      const cat2 = new Cat();
      viewport.addChild(cat);
      viewport.addChild(cat2);

      const turtle = new Turtle();
      const turtle2 = new Turtle();
      viewport.addChild(turtle);
      viewport.addChild(turtle2);

      initDevtools({ app });
      container!.appendChild(app.canvas);
    })();
  });

  return (
    <div class="flex justify-center items-center w-full h-6/12 lg:h-full flex-1 ">
      <div class="w-full h-full max-w-[1440px] mx-auto" ref={container}></div>
    </div>
  );
}

export default Island;
