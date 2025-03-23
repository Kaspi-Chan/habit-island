const Task = () => {
  return (
    <li class="list-row items-center bg-base-100">
      <div class="list-col-grow flex flex-col gap-2">
        <span class="text-base">Read 10 pages of a book</span>
        <div class="flex gap-1">
          <div class="badge badge-soft badge-primary">Knowledge</div>
          <div class="badge badge-soft badge-secondary">Mindfulness</div>
          <div class="badge badge-soft badge-info">Mindfulness</div>
        </div>
      </div>
      <div>
        <input type="checkbox" class="checkbox rounded-xl" />
      </div>
    </li>
  );
};

export default Task;
