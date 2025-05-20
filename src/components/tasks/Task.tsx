import { removeTask } from "../../firebase/firestore";
import { userInfo, type Task } from "../store/userStore";

const Task = (props: Task) => {
  return (
    <li class="list-row items-center bg-base-100">
      <div class="list-col-grow flex flex-col gap-2">
        <span class="text-base">{props.title}</span>
        <div class="flex gap-1">
          <div class="badge badge-soft badge-primary">Knowledge</div>
          <div class="badge badge-soft badge-secondary">Mindfulness</div>
          <div class="badge badge-soft badge-info">{props.category}</div>
        </div>
      </div>
      <div>
        <input
          type="checkbox"
          class="checkbox rounded-xl"
          onclick={() => removeTask(userInfo.id, props.id)}
        />
      </div>
    </li>
  );
};

export default Task;
