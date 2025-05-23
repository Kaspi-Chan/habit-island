import { COLORS, XP_PER_LEVEL } from "../../config";
import { skillType } from "../../types";

interface ProgressBarProps {
  progress: number;
  label: skillType | "XP";
  level: number;
}

const ProgressBar = (props: ProgressBarProps) => {
  const styles = COLORS[props.label] ?? "custom-skill";

  return (
    <div class="flex flex-1 flex-row items-center justify-between font-semibold">
      <div class="tracking-wide mr-1">{props.label}</div>
      <div class="flex items-center">
        <div class="mr-1.5">
          <span class="mr-1">LVL:</span>
          <span class="font-bold text-xl">{props.level}</span>
        </div>
        <div class={`w-32 lg:w-40 h-3 track-color ${styles} rounded-2xl`}>
          <div
            style={{ width: `${props.progress % XP_PER_LEVEL}%` }}
            class={`h-full rounded-2xl transition-all duration-300 ease-in-out fill-color ${styles}`}></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
