import { useTasks } from '../Tasks.js';

import '../../cssModules/dashboard.css';
import '../../cssModules/views/tasklist.css';

function TaskItem({ task }) {
  return (
    <div key={task.id} className="task-item d-flex p-3 bg-light">
      {/* DATE & TIME */}
      <div className="task-period col-4 col-md-3 col-lg-2 text-center">
        <p className="mb-1 fw-bold">{task.date}</p>
        <p className="mb-0">
          {task.startTime}
          {task.endTime ? ` - ${task.endTime}` : ""}
        </p>
      </div>
      {/* TASK INFO */}
      <div className="task-info col-8 col-md-9 col-lg-10 ps-3 text-start">
        <h5 className="mb-1">{task.taskName}</h5>
        <p className="mb-1">{task.category}</p>
        <p className="mb-0">{task.description}</p>
      </div>
    </div>
  );
}

function TaskList() {
  const { tasks, getTask } = useTasks();

  return (
    <div className="content tasklist-container d-flex flex-grow-1 row justify-content-center align-item-start bg-secondary">
      <div className="tasklist-content px-4">
        {tasks.length === 0 ? (
          <p className="text-muted">No task yet</p>
        ) : (
          tasks.map((t) =>
            <TaskItem key={t.id} task={t} />)
        )}
      </div>
    </div>
  );
}

export default TaskList;