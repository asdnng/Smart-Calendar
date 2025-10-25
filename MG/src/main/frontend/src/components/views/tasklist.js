import { useState, useEffect } from 'react';

import { BsTagFill, BsThreeDots, BsSortDownAlt, BsFunnelFill } from 'react-icons/bs';

import { useTasks } from '../Tasks.js';
import { Categories } from '../categories.js';
import CRUD from '../crud/crud.js';

import '../../cssModules/dashboard.css';
import '../../cssModules/views/tasklist.css';

const changeColorOpacity = (rgbaString, newOpacity) => {
  const match = rgbaString.match(/rgba?\(([^)]+)\)/);
  if (!match) return rgbaString;

  const components = match[1].split(',');
  const rgb = components.slice(0, 3);
  return `rgba(${rgb.join(', ')}, ${newOpacity})`;
};

function TaskItem({ task, openTask }) {
  const taskCategory = Categories.find((c) => c && c.value === task.category);

  return (
    <div 
      key={task.id} 
      className="task-item cursor-pointer d-flex p-2 bg-light" 
      onClick={() => openTask(task.id)}
    >
      {/* DATE & TIME */}
      <div className="task-period col-4 col-md-3 col-lg-2 py-2 text-center">
        <p className="mb-1 fw-bold">{task.date.split('-').reverse().join('-')}</p>
        <p className="mb-0 fw-semibold">
          {task.startTime}
          {task.endTime ? ` - ${task.endTime}` : ""}
        </p>
      </div>
      {/* TASK INFO */}
      <div 
        className="task-info col-8 col-md-9 col-lg-10 px-4 py-3 text-start rounded-4"
        style= {{ backgroundColor: changeColorOpacity(taskCategory.color, 0.5) }}
      >
        <h4 className="mb-1 fw-semibold">{task.taskName}</h4>
        <p className="mb-1"><BsTagFill className="me-2"/> {task.category}</p>
        {task.description && <BsThreeDots className="mb-0 mt-2 text-dark" />}
      </div>
    </div>
  );
}

function TaskList() {
  const { tasks, tasksByDate, tasksByRecency } = useTasks();
  const hasTasks = tasks.length > 0;
  const [arrangedTasks, setArrangedTasks] = useState(tasksByDate());
  const [taskId, setTaskId] = useState();
  const [sortBy, setSortBy] = useState("date");
  const [crudOpen, setCrudOpen] = useState(false);

  const showTask = (id) => {
    setCrudOpen(true);
    setTaskId(id);
  };

  useEffect(() => {
    if (sortBy === "date") setArrangedTasks(tasksByDate());
    else setArrangedTasks(tasksByRecency());
  }, [tasks, sortBy, setArrangedTasks, tasksByDate, tasksByRecency]);

  return (
    <div 
      className={`content tasklist-container d-flex flex-grow-1 ${
        hasTasks
          ? "justify-content-center align-items-start bg-secondary"
          : "justify-content-center align-items-center bg-light"
      }`}
    >
      {/* TASKLIST CONTENT */}
      <div className="tasklist-content row w-100 mt-0 px-3 text-center">
        {/* TASKLIST TOP BAR */}
        {hasTasks &&
          <div className="tasklist-options mb-2 pe-2 pt-3 pb-2 bg-secondary">
            {/* SORTING SELECTION */}
            <div className="sort-tasks">
              <BsSortDownAlt className="me-2 text-white fs-2"/>
              <select 
                className="ms-2 px-3 py-2 rounded-pill bg-white cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>date</option>
                <option>recently added</option>
              </select>
            </div>

            {/* FILTER SELECTIONS */}
            <button 
              className="filter-tasks btn d-flex ms-2 rounded-3 fs-4 text-center"
              disabled
            >
              <BsFunnelFill />
            </button>
          </div>
        }

        {/* TASKLIST ITEMS */}
        {tasks.length === 0 ? (
          <p className="text-muted">No task yet</p>
        ) : (
          arrangedTasks.map((t) =>
            <TaskItem key={t.id} task={t} openTask={showTask}/>)
        )}
      </div>

      {/* CRUD POPUP */}
      <CRUD isOpen={crudOpen} onClose={() => setCrudOpen(false)} mode="read" selectedTaskId={taskId} />
    </div>
  );
}

export default TaskList;