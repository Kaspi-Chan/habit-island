import PlusIconBtn from "../misc/PlusIconBtn";

const NewTaskBtn = () => {
  const clickHanlder = () => {
    const newTaskModal = document.getElementById(
      "new-task-modal"
    ) as HTMLDialogElement;

    newTaskModal.show();
  };

  return (
    <PlusIconBtn
      class="w-full bg-base-100 border-0 pl-0 justify-start"
      click={clickHanlder}>
      <span class="ml-2">Add new goal</span>
    </PlusIconBtn>
  );
};

export default NewTaskBtn;
