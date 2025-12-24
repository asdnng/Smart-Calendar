import { useEffect, useState } from 'react';

import { useTasks } from '../Tasks';
import { computeColumns as tasksColumn } from './uitilities/Computation.js';
import { ViewHeader, HoursLabels, TimelineGrid, CurrentTimeBar, TimedTasksColumn, UntimedTasksList, useScheduleLogic } from './uitilities/schedule.js';
import CRUD from '../crud/crud';

import '../../cssModules/views/day.css';

function DayView() {
  const { tasks, tasksByDate, getFilteredTasks } = useTasks();
  
  const {
    selectedDate, setSelectedDate, isToday, goToToday,
    taskId, crudOpen, setCrudOpen, handleOpenTask,
    currentMinutes
  } = useScheduleLogic();

  /* TASKS STATE */
  const [dateTasks, setDateTasks] = useState([]);
  const [timedTasks, setTimedTasks] = useState([]);
  const [untimedTasks, setUntimedTasks] = useState([]);
  const hasTasks = tasks.length > 0 && dateTasks.length > 0;

  useEffect(() => {
    const newDateTasks = getFilteredTasks(tasksByDate(), { date: selectedDate });
    const newTimedTasks = tasksColumn(newDateTasks.filter(t => t.startTime && t.endTime));
    const newUntimedTasks = newDateTasks.filter(t => !t.startTime || !t.endTime);

    setDateTasks(newDateTasks);
    setTimedTasks(newTimedTasks);
    setUntimedTasks(newUntimedTasks);
  }, [selectedDate, getFilteredTasks, tasksByDate]);

  return (
    <div className="dayview-container d-flex row">
      {/* TOP BAR */}
      <ViewHeader 
        hasTasks={hasTasks} 
        emptyLabel={"No task"} 
        isToday={isToday} 
        onGoToToday={goToToday} 
        inputType={"date"}
        selectedOpt={selectedDate} 
        onOptChange={setSelectedDate} 
      />
      
      {/* CONTENT WITH TWO SECTIONS */}
      <div className="dayview-content d-flex flex-grow-1">
        {/* LEFT SECTION: TIMED TASKS -> timeline */}
        <div className="timed-tasks-section d-flex col-8">
          {/* Hours Labels */}
          <HoursLabels pxScale={2} />

          {/* Tasks Timeline */}
          <div className="timeline-container flex-grow-1 col-10 bg-white">
            <div className="timeline-content position-relative">
              {/* time grid & 10-minute lines */}
              <TimelineGrid pxScale={2} today={false} />

              {/* current time bar */}
              {isToday && (
                <CurrentTimeBar pxScale={2} currMinutes={currentMinutes} withText={true} />
              )}

              {/* TIMED TASKS */}
              <TimedTasksColumn 
                tasks={timedTasks} 
                onTaskClick={handleOpenTask} 
                padding={"px-4"} 
                pxScale={2} 
              />
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
                  <UntimedTasksList task={task} onTaskClick={handleOpenTask} />
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