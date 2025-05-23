import { Portal } from "solid-js/web";
import SkillBars from "./tasks/SkillBars.jsx";
import TasksList from "./tasks/TasksList.jsx";
import Toast from "./misc/Toast.jsx";

const MainView = () => {
  return (
    <div
      class="absolute lg:static lg:max-w-[400px] 2xl:max-w-lg lg:py-16 mt-6 top-6/12 h-6/12 left-[2.5%] 
      w-[95%] min-h-[100vh] flex flex-col">
      <SkillBars />
      <TasksList />
      <Portal>
        <Toast />
      </Portal>
    </div>
  );
};

export default MainView;
