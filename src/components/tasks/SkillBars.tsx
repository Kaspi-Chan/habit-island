import ProgressBar from "./progressBar.jsx";

const SkillBars = () => {
  return (
    <div class="collapse bg-base-200 border-2 border-accent ">
      <input type="checkbox" />
      <div class="collapse-title flex pr-0">
        <ProgressBar label={"XP"} progress={69} type="primary" />
        <button class="btn btn-info btn-soft mx-6 z-10" >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
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
        <ProgressBar label={"Relationships"} progress={42} type="error" />
        <ProgressBar label={"Fitness"} progress={52} type="info" />
        <ProgressBar label={"Coding"} progress={16} type="warning" />
        <ProgressBar label={"Cooking"} progress={16} type="secondary" />
      </div>
    </div>
  );
};

export default SkillBars;
