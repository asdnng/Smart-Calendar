import { useEffect, useState } from 'react';

import { BsCaretLeftFill, BsCaretRightFill, BsFillCalendarCheckFill } from 'react-icons/bs';

import { useTasks } from '../Tasks';
import { Categories, changeColorOpacity as newColorOpacity } from '../Categories';
import { getTodayDateString as todayDate, getTodayCurrentMinutes as todayTime } from './uitilities/Date';
import CRUD from '../crud/crud';

import '../../cssModules/views/day.css';

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function computeColumns(tasks) {
  const columns = [];
  let currentGroup = [];
  const groups = [];

  const result = tasks.map(task => {
    const start = toMinutes(task.startTime);
    const end = toMinutes(task.endTime);

    let column = columns.findIndex(col => col <= start);
    if (column === -1) {
      column = columns.length;
      columns.push(end);
    } else columns[column] = end;

    const enrichedTask = { ...task, start, end, column };

    if (currentGroup.length === 0 || start < Math.max(...currentGroup.map(t => t.end))) {
      currentGroup.push(enrichedTask);
    } else {
      groups.push(currentGroup);
      currentGroup = [enrichedTask];
    }

    return enrichedTask;
  });

  if (currentGroup.length) groups.push(currentGroup);

  groups.forEach(group => {
    const maxCols = Math.max(...group.map(t => t.column)) + 1;
    group.forEach(task => {
      task.totalCols = maxCols;
    });
  });

  return result;
}

function DayView() {
  const { tasks, tasksByDate, getFilteredTasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState(todayDate());
  const [isToday, setIsToday] = useState(true);
  /* TASKS STATE */
  const [dateTasks, setDateTasks] = useState([]);
  const [timedTasks, setTimedTasks] = useState([]);
  const [untimedTasks, setUntimedTasks] = useState([]);
  const hasTasks = tasks.length > 0 && dateTasks.length > 0;

  const [taskId, setTaskId] = useState();
  const [crudOpen, setCrudOpen] = useState(false);
  /* TIME STATE AND VARIABLE */
  const [currentMinutes, setCurrentMinutes] = useState(0);
  const currentTimeBar = 2 * currentMinutes;
  const hours = [...Array(24)].map((_, i) => i);

  useEffect(() => {
    setCurrentMinutes(todayTime());

    const intervalTime = setInterval(() => {
      setCurrentMinutes(todayTime());
    }, 60000);

    return () => clearInterval(intervalTime);
  }, []);

  useEffect(() => {
    const newDateTasks = getFilteredTasks(tasksByDate(), { date: selectedDate });
    const newTimedTasks = computeColumns(newDateTasks.filter(t => t.startTime && t.endTime));
    const newUntimedTasks = newDateTasks.filter(t => !t.startTime || !t.endTime);

    setDateTasks(newDateTasks);
    setTimedTasks(newTimedTasks);
    setUntimedTasks(newUntimedTasks);
  }, [selectedDate, getFilteredTasks, tasksByDate]);

  useEffect(() => {
    setIsToday(selectedDate === todayDate());
  }, [selectedDate]);

  const goToToday = () => setSelectedDate(todayDate());

  const handleOpenTask = (id) => {
    setCrudOpen(true);
    setTaskId(id);
  };

  const taskCategoryColor = (taskCategory) => {
    const normalizedCategory = taskCategory ? taskCategory.toLowerCase() : null;
    const category = Categories.find((c) => c && c.value === normalizedCategory);
    const defaultColor = "rgba(130, 130, 130, 0.65)";

    return category?.color || defaultColor;
  };

  return (
    <div className="dayview-container d-flex row">
      {/* TOP BAR */}
      <div className="topbar bg-light d-flex py-2 fw-bold">
        <span className="ps-2 d-flex flex-grow-1 align-items-center">
          {!hasTasks && "No task"}
        </span>
        <span className="d-flex align-items-center justify-content-end">
          {/* <BsCaretLeftFill className="me-3 fs-1" /> */}
            {isToday ? 
              <span className="me-3 fw-semibold text-secondary">Today</span>
              : <BsFillCalendarCheckFill className="me-3 fs-4 cursor-pointer" onClick={goToToday} />
            }
            <input 
              type="date" 
              className="form-control me-2 cursor-pointer rounded-pill"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          {/* <BsCaretRightFill className="ms-3 me-3" /> */}
        </span>
      </div>
      
      {/* CONTENT WITH TWO SECTIONS */}
      <div className="dayview-content d-flex flex-grow-1">

        {/* LEFT SECTION: TIMED TASKS -> timeline */}
        <div className="timed-tasks-section d-flex col-8">
          {/* Hours Labels */}
          <div className="hour-labels-container col-2 bg-dark text-center text-light fw-semibold">
            {hours.map((h) => (
              <div key={h} className="hour-label bg-dark">
                {String(h).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Tasks Timeline */}
          <div className="timeline-container flex-grow-1 col-10 bg-white">
            <div className="timeline-content position-relative">
              {/* time grid */}
              {hours.map((h) => (
                <div key={h} className="timeline-hour bg-white"></div>
              ))}

              {/* 10-minute lines */}
              {Array.from({ length: 24 * 6 }).map((_, i) => (
                <div
                  key={i}
                  className="ten-minute-line position-absolute"
                  style={{ top: i * 20 }}
                >
                </div>
              ))}

              {/* current time bar */}
              {isToday && (
                <div
                  className="current-time-bar position-absolute pe-3 text-end"
                  style={{ top: currentTimeBar }}
                >
                  CURRENT TIME
                </div>
              )}

              {/* TASKS */}
              {timedTasks.map((task) => {
                const top = 2 * task.start;
                const height = 2 * (task.end - task.start);

                const width = 100 / task.totalCols;
                const left = width * task.column;

                return (
                  <div
                    key={task.id}
                    className="task-block position-absolute px-4 cursor-pointer"
                    style={{ 
                      top, 
                      height,
                      left: `${left}%`,
                      width: `${width}%`, 
                      backgroundColor: newColorOpacity(taskCategoryColor(task.category), 0.65) 
                    }}
                    onClick={() => handleOpenTask(task.id)}
                  >
                    <strong>{task.taskName}</strong><br />
                    {task.startTime} - {task.endTime}
                  </div>
                );
              })}

            </div>
          </div>

        </div>
        
        {/* RIGHT SECTION: UNTIMED TASKS -> list */}
        <div className="untimed-tasks-section col-4 col px-4 bg-light">
          {untimedTasks.length === 0 ?
            <div className="d-flex flex-grow-1 pt-4 text-secondary justify-content-center">
              <p>No untimed task</p>
            </div>
            : 
            <div className="untimed-tasks-content d-flex flex-grow-1 row justify-content-center">
              <p className="d-flex py-2 fw-semibold text-black justify-content-center border-bottom">Untimed Tasks</p>
              {untimedTasks.map((task) => {
                return (
                  <div
                    key={task.id}
                    className="task-block position- mb-1 px-3 py-2 cursor-pointer rounded-3 text-dark"
                    style={{ backgroundColor: newColorOpacity(taskCategoryColor(task.category), 0.65) }}
                    onClick={() => handleOpenTask(task.id)}
                  >
                    <strong>{task.taskName}</strong><br />
                    {task.startTime ? `At ${task.startTime}` : ""}
                  </div>
                );
              })}
            
            </div>
          }

        </div>

      </div>

      {/* CRUD POPUP */}
      <CRUD isOpen={crudOpen} onClose={() => setCrudOpen(false)} mode="read" selectedTaskId={taskId} />
    </div>
  );
}

export default DayView;