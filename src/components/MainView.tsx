import { Portal } from "solid-js/web";
import NewTaskModal from "./tasks/NewTaskModal.jsx";
import SkillBars from "./tasks/SkillBars.jsx";
import TasksList from "./tasks/TasksList.jsx";
import Toast from "./misc/Toast.jsx";

const MainView = () => {
  return (
    <div class="fixed top-6/12 h-6/12 left-[2.5%] w-[95%] flex flex-col">
      <SkillBars />
      <TasksList />
      <NewTaskModal />
      <Portal>
        <Toast />
      </Portal>
    </div>
  );
};

export default MainView;
