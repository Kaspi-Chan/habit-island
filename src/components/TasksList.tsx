import Task from "./Task.jsx";

const TasksList = () => {
  return (
    <div class="fixed top-8/12 left-[2.5%] w-[95%] max-h-5/12 overflow-y-scroll rounded-box border-2 border-primary">
      <ul class="list bg-base-300 rounded-box shadow-md w-full gap-2">
        <li class="p-4 pb-2 text-lg tracking-wide">
          Daily Tasks
        </li>
        <Task />
        <Task />
        <Task />
        <Task />
        <Task />
        <Task />
      </ul>
    </div>
  );
};

export default TasksList;
