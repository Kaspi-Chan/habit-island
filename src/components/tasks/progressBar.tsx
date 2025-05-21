import { XP_PER_LEVEL } from "../../config";
import { skillType } from "../store/userStore";

interface ProgressBarProps {
  progress: number;
  label: skillType | "XP";
  level: number;
}

const ProgressBar = (props: ProgressBarProps) => {
  return (
    <div class="flex flex-1 flex-row items-center justify-between font-semibold ">
      <div class="uppercase tracking-wide">{props.label}</div>
      <div class="flex items-center">
        <div class="mr-1.5">
          <span class="mr-1">LVL:</span>
          <span class="font-bold text-xl">{props.level}</span>
        </div>
        <div class={`w-32 sm:w-56 h-3 bg-accent/20 rounded-2xl`}>
          <div
            style={{ width: `${props.progress % XP_PER_LEVEL}%` }}
            class={`h-full rounded-2xl transition-all duration-300 ease-in-out bg-accent`}></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
