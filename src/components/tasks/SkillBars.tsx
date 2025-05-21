import { For } from "solid-js";
import ProgressBar from "./progressBar.jsx";
import { userInfo } from "../store/userStore.js";

const SkillBars = () => {
  return (
    <div class="collapse bg-base-200 border-2 border-accent ">
      <input type="checkbox" />
      <div class="collapse-title flex pr-0">
        <ProgressBar
          label={"XP"}
          progress={userInfo.xp}
          level={userInfo.level}
        />
        <button class="btn btn-info btn-soft mx-6 z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
      <div class="collapse-content text-sm">
        <For each={userInfo.skills}>
          {(skill) => (
            <ProgressBar
              label={skill.name}
              progress={skill.currentXP}
              level={skill.level}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default SkillBars;
