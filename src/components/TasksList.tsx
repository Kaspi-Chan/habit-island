import NewTaskBtn from "./NewTaskBtn.jsx";
import Task from "./Task.jsx";

const TasksList = () => {
  return (
    <ul class="list bg-base-300 rounded-box shadow-md w-full gap-2 pb-8 relative top-4 overflow-y-scroll border-2 border-primary flex-1">
      <li class="p-4 pb-2 text-lg tracking-wide">Daily Tasks</li>
      <Task />
      <Task />
      <Task />
      <Task />
      <Task />
      <Task />
      <li class="list-row items-center bg-base-100">
        <NewTaskBtn />
        <span>Add new goal</span>
      </li>
    </ul>
  );
};

export default TasksList;
