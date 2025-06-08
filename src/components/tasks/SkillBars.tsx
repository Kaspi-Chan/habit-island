import { createEffect, createSignal, For, Show } from "solid-js";
import ProgressBar from "./progressBar.jsx";
import { setUserInfo, userInfo } from "../store/userStore.js";
import PlusIconBtn from "../misc/PlusIconBtn.jsx";
import { addSkill } from "../../firebase/firestore.js";
import { showToast } from "../store/toastStore.js";
import { Skill } from "../../types/index.js";

const SkillBars = () => {
  let inputRef: HTMLInputElement;
  const [toggleBtn, setToggleBtn] = createSignal(false);
  const [skillTitle, setSkillTitle] = createSignal("");
  const [isOpen, setIsOpen] = createSignal(false);

  const handleNewSkill = async (e: SubmitEvent) => {
    e.preventDefault();

    if (!toggleBtn()) setToggleBtn(true);
    inputRef!.focus();

    if (skillTitle() === "") return;

    const newSkill: Skill = {
      name: skillTitle(),
      currentXP: 0,
      level: 1,
    };

    try {
      await addSkill(userInfo.id, newSkill);
      showToast(`Skill added successfully !`);
    } catch (error) {
      showToast(`An error occured!`, 3000, "error");
      console.error(error);
    }
    reset();
  };

  const handleToggle = () => {
    setIsOpen(!isOpen());

    if (!isOpen()) reset();
  };

  const reset = () => {
    setSkillTitle("");
    setToggleBtn(false);
  };

  return (
    <div class="collapse bg-base-200 border-2 border-accent ">
      <input onClick={handleToggle} type="checkbox" />
      <div class="collapse-title flex pr-0">
        <ProgressBar
          label={"XP"}
          progress={userInfo.xp}
          level={userInfo.level}
        />
        <div class="flex items-center justify-center ml-2 px-2 mr-4 ">
          <svg
            class={`h-5 w-5 transition-transform ${
              isOpen() ? "-rotate-90" : "rotate-90"
            }`}
            fill="none"
            viewBox="-19.04 0 75.804 75.804"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            stroke-width="2.4257280000000003">
            <g id="SVGRepo_bgCarrier" stroke-width="0" />
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              <g
                id="Group_65"
                data-name="Group 65"
                transform="translate(-831.568 -384.448)">
                <path
                  id="Path_57"
                  data-name="Path 57"
                  d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z"
                  fill="#000000"
                />
              </g>
            </g>
          </svg>
        </div>
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
        <Show when={userInfo.skills.length < 10}>
          <form onSubmit={handleNewSkill}>
            <Show when={!toggleBtn()}>
              <PlusIconBtn class="pl-0 w-full flex items-center justify-start gap-4 mt-2">
                <span>Add new skill</span>
              </PlusIconBtn>
            </Show>
            <Show when={toggleBtn()}>
              <div class="flex items-center justify-start mt-4">
                <PlusIconBtn class="pl-0" />
                <input
                  ref={inputRef!}
                  type="text"
                  value={skillTitle()}
                  onInput={(e) => setSkillTitle(e.currentTarget.value)}
                  class="input input-ghost w-full"
                  placeholder="Spanish proficiency"
                  required
                />
              </div>
            </Show>
          </form>
        </Show>
      </div>
    </div>
  );
};

export default SkillBars;
