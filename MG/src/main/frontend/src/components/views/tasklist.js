import { useState, useEffect, useMemo } from 'react';

import { BsTagFill, BsThreeDots, BsCircle, BsCheckCircleFill } from 'react-icons/bs';

import { useTasks } from '../Tasks.js';
import { Categories, changeColorOpacity as newColorOpacity } from '../Categories.js';
import CRUD from '../crud/crud.js';
import DeleteTask from '../crud/delete.js';
import Sort from './uitilities/sort.js';
import Filter from './uitilities/filter.js';
import Switcher from '../switcher.js';
import gilNoTask from '../../assets/gil-no-task.png';

import '../../cssModules/dashboard.css';
import '../../cssModules/views/tasklist.css';

function TaskItem({ task, openTask, deleting, selectTask, deselectTask, selectedTasks }) {
  // Normalize category to lowercase for matching, and provide fallback for undefined categories
  const normalizedCategory = task.category ? task.category.toLowerCase() : null;
  const taskCategory = Categories.find((c) => c && c.value === normalizedCategory);
  const defaultColor = "rgba(130, 130, 130, 1)"; // "other" category color as fallback
  const categoryColor = taskCategory?.color || defaultColor;

  const handleClick = () => {
    const handleSelect = () => {
      selectedTasks.includes(task.id) ? deselectTask() : selectTask();
    };

    deleting ? handleSelect() : openTask(task.id);
  };

  return (
    <div 
      key={task.id} 
      className="task-item cursor-pointer d-flex p-2 bg-light" 
      onClick={handleClick}
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
        className={`task-info ${deleting ? "col-7" : "col-8"} col-md-9 col-lg-10 px-4 py-3 text-start rounded-4`}
        style= {{ backgroundColor: newColorOpacity(categoryColor, 0.5) }}
      >
        <h4 className="mb-1 fw-semibold">{task.taskName}</h4>
        <p className="mb-1"><BsTagFill className="me-2"/> {task.category}</p>
        {task.description && <BsThreeDots className="mb-0 mt-2 text-dark" />}
      </div>

      {/* SELECT TO DELETE */}
      {deleting && (
        <div className="d-flex col-1 align-items-center justify-content-center">
          {selectedTasks.includes(task.id) ? <BsCheckCircleFill style={{ color: "rgba(140, 187, 203, 1)" }} /> : <BsCircle />}
        </div>
      )}
    </div>
  );
}

function TaskList() {
  const { tasks, tasksByDate, tasksByRecency, getFilteredTasks, removeTask } = useTasks();
  const hasTasks = tasks.length > 0;
  const [arrangedTasks, setArrangedTasks] = useState(tasksByDate());
  const [taskId, setTaskId] = useState();
  const [selectedTasksId, setSelectedTasksId] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [crudOpen, setCrudOpen] = useState(false);

  const showTask = (id) => {
    setCrudOpen(true);
    setTaskId(id);
  };

  useEffect(() => {
    if (sortBy === "date") setArrangedTasks(tasksByDate());
    else setArrangedTasks(tasksByRecency());
  }, [tasks, sortBy, setArrangedTasks, tasksByDate, tasksByRecency]);

  const filteredTasks = useMemo(() => {
    return getFilteredTasks(arrangedTasks, { category: selectedCategories });
  }, [arrangedTasks, selectedCategories, getFilteredTasks]);

  const handleSwitch = () => {
    setSelectedTasksId([]);
    setDeleteMode((prev) => !prev)
  };

  const handleSelectAllTasks = () => {
    const allTasksId = filteredTasks.map(task => task.id);
    const uniqueTasksId = new Set([...selectedTasksId, ...allTasksId]);
    setSelectedTasksId(Array.from(uniqueTasksId));
  };

  const handleDeleteTasks = async () => {
    for(const taskId of selectedTasksId) await removeTask(taskId);
    setSelectedTasksId([]);
    setDeleteMode(false);
  };

  return (
    <div 
      className={`content tasklist-container d-flex flex-grow-1 justify-content-center ${
        hasTasks
          ? "align-items-start bg-secondary"
          : "align-items-center bg-light"
      }`}
    >
      {/* TASKLIST CONTENT */}
      <div className="tasklist-content row w-100 mt-0 px-3 justify-content-center text-center">
        {/* TASKLIST TOP BAR */}
        {hasTasks &&
          <div className="tasklist-options d-flex col mb-2 pe-1 ps-1 pt-3 pb-2 bg-secondary">
            {/* DELETE MODE SWITCHER */}
            <div className="d-flex col-6 justify-content-start">
              <Switcher 
                switched={deleteMode}
                onSwitched={handleSwitch}
                defaultText="View"
                text="DLT"
                hasIcon={false}
              />
            </div>

            <div className="d-flex col-6 justify-content-end">
              {!deleteMode ?
                <>
                  {/* SORTING SELECTION */}
                  <Sort sortValue={sortBy} sortChange={(e) => setSortBy(e.target.value)} />
                  {/* FILTER SELECTION */}
                  <Filter 
                    dropdown={showDropdown} 
                    OnDropdown={() => setShowDropdown(!showDropdown)}
                    category={selectedCategories}
                    categoryChange={(e) => setSelectedCategories(e)}
                  />
                </>
                /* DELETING SELECTION */
                : <DeleteTask 
                    selectedAll={selectedTasksId.length === tasks.length} 
                    onSelectAll={handleSelectAllTasks}
                    onDeleteTasks={handleDeleteTasks}
                    selectedTasksNum={selectedTasksId.length}
                  />
              }
            </div>
          </div>
        }

        {/* TASKLIST ITEMS */}
        {!hasTasks ? (
          <img
            src={gilNoTask}
            alt="No task yet"
            style={{ width: "350px" }}
          />
        ) : (
          filteredTasks.map((t) =>
            <TaskItem 
              key={t.id} 
              task={t} 
              openTask={showTask}
              deleting={deleteMode}
              selectTask={() => setSelectedTasksId([...selectedTasksId, t.id])}
              deselectTask={() => setSelectedTasksId(selectedTasksId.filter((id) => id !== t.id))}
              selectedTasks={selectedTasksId}
            />
          )
        )}
      </div>

      {/* CRUD POPUP */}
      <CRUD isOpen={crudOpen} onClose={() => setCrudOpen(false)} mode="read" selectedTaskId={taskId} />
    </div>
  );
}

export default TaskList;