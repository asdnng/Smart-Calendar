import { useEffect, useState } from 'react';

import { useTasks } from '../Tasks';
import { formatDate } from './uitilities/Date';
import { getTodayDateString as todayDate } from './uitilities/Date';
import { computeColumns as tasksColumn } from './uitilities/Computation';
import { ViewHeader, HoursLabels, TimelineGrid, CurrentTimeBar, TimedTasksColumn, UntimedTasksList, useScheduleLogic } from './uitilities/schedule';
import CRUD from '../crud/crud';

import '../../cssModules/views/week.css';

function isSameWeek(dateA, dateB) {
  const a = new Date(dateA);
  const b = new Date(dateB);
  const startA = new Date(a);
  const startB = new Date(b);

  startA.setDate(a.getDate() - a.getDay());
  startB.setDate(b.getDate() - b.getDay());
  return startA.toDateString() === startB.toDateString();
}

function weekRange(dateString) {
  const date = new Date(dateString);
  const start = new Date(date);
  const end = new Date(start);

  start.setDate(date.getDate() - date.getDay());
  end.setDate(start.getDate() + 6);
  return { start, end };
}

function WeekView() {
  const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const { tasks, tasksByDate, getFilteredTasks } = useTasks();

  const {
    selectedDate, setSelectedDate, isToday, goToToday,
    taskId, crudOpen, setCrudOpen, handleOpenTask,
    currentMinutes
  } = useScheduleLogic();

  const [isTodayInWeek, setIsTodayInWeek] = useState(true);
  const todayObject = new Date(todayDate());
  const todayIdx = todayObject.getDay(); 

  const { start: weekStart, end: weekEnd } = weekRange(selectedDate);
  const weekRangeLabel = 
  `${formatDate(weekStart.toISOString().split("T")[0], false)} - 
   ${formatDate(weekEnd.toISOString().split("T")[0], false)}`;

  /* TASKS STATE */
  const [selectedDayIdx, setSelectedDayIdx] = useState();
  const [weekTasks, setWeekTasks] = useState([[], [], [], [], [], [], []]);
  const [timedTasks, setTimedTasks] = useState([[], [], [], [], [], [], []]);
  const [untimedTasks, setUntimedTasks] = useState([[], [], [], [], [], [], []]);
  const hasTasks = tasks.length > 0 && weekTasks.some(dayTasks => dayTasks.length > 0);

  useEffect(() => {
    // Calculate the start of the week
    const currDate = new Date(selectedDate);
    const dayOfWeek = currDate.getDay();  // 0 (Sun) to 6 (Sat)
    const startDateOfWeek = new Date(currDate);  // Sunday
    startDateOfWeek.setDate(currDate.getDate() - dayOfWeek);

    const newWeekTasks = [];
    const newTimedTasks = [];
    const newUntimedTasks = [];

    for (let i = 0; i < 7; i++) {
      const thisDate = new Date(startDateOfWeek);
      thisDate.setDate(startDateOfWeek.getDate() + i);

      const dateString = thisDate.toISOString().split('T')[0];
      const dayTasks = getFilteredTasks(tasksByDate(), { date: dateString });

      newWeekTasks.push(dayTasks);
      newTimedTasks.push(tasksColumn(dayTasks.filter(t => t.startTime && t.endTime)));
      newUntimedTasks.push(dayTasks.filter(t => !t.startTime || !t.endTime));
    }

    setWeekTasks(newWeekTasks);
    setTimedTasks(newTimedTasks);
    setUntimedTasks(newUntimedTasks);
    setSelectedDayIdx(dayOfWeek);
    setIsTodayInWeek(isSameWeek(todayDate(), selectedDate));
  }, [selectedDate, getFilteredTasks, tasksByDate]);

  const isTodayCol = (idx) => isTodayInWeek && idx === todayIdx;

  return (
    <div className="weekview-container d-flex">
      {/* TOP BAR */}
      <ViewHeader 
        hasTasks={hasTasks} 
        emptyLabel={"No task this week"} 
        isToday={isToday} 
        onGoToToday={goToToday} 
        inputType={"date"}
        selectedOpt={selectedDate} 
        onOptChange={setSelectedDate} 
      />
      
      {/* CONTENT WITH TWO SECTIONS */}
      <div className="weekview-content d-flex flex-grow-1 row">
        {/* DAYS TOP BAR */}
        <div className="timed-topbar d-flex py-4 bg-dark text-light fw-semibold">
          <div className="col-1" />
          <div className="col-11 position-relative align-items-center">
            {daysInWeek.map((day, index) => {
              const width = 100 / daysInWeek.length;
              const left = width * index;

              return (
                <div
                  key={index}
                  className={`position-absolute text-center rounded-pill 
                    ${index === selectedDayIdx ? "selectedDate" : `${isTodayCol(index) ? "today" : ""}`}`
                  }
                  style={{ left: `${left}%`, width: `${width}%` }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* TOP SECTION: TIMED TASKS -> week timeline */}
        <div className="timed-tasks-section d-flex bg-white">
          {/* Hours Labels */}
          <HoursLabels pxScale={1} />

          {/* Tasks Timeline */}
          <div className="timeline-container flex-grow-1 col-10 bg-white">
            <div className="timeline-content position-relative">
              {timedTasks.map((dayTasks, index) => {
                const dayWidth = 100 / daysInWeek.length;
                const dayLeft = dayWidth * index;

                return (
                  <div
                    key={index}
                    className="position-absolute text-center border-start"
                    style={{ left: `${dayLeft}%`, width: `${dayWidth}%` }}
                  >
                    {/* time grid & 10-minute lines */}
                    <TimelineGrid pxScale={1} today={isTodayCol(index)} />

                    {/* current time bar */}
                    {isTodayCol(index) && (
                      <CurrentTimeBar pxScale={1} currMinutes={currentMinutes} withText={false} />
                    )}

                    {/* TIMED TASK */}
                    <TimedTasksColumn 
                      tasks={dayTasks} 
                      onTaskClick={handleOpenTask} 
                      padding={"p-1"} 
                      pxScale={1} 
                      changeSize={true} 
                    />
                  </div>
                );

              })}
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: UNTIMED TASKS -> day tasks list */}
        <div className="untimed-tasks-section bg-light">
          {/* TITLE BAR */}
          <div className="untimed-topbar pt-3 px-4 row fw-semibold">
            <span className="d-flex col-4 ps-2 pb-2 justify-content-start text-black">Untimed Tasks</span>
            <span className="d-flex col-8 pe-2 pb-2 justify-content-end text-dark">{weekRangeLabel}</span>
          </div>

          {/* UNTIMED TASKS CONTENT */}
          <div className="untimed-tasks-content justify-content-center">
            {/* UNTIMED TASKS LIST */}
            <div className="untimed-tasks mx-3">
              {untimedTasks.some(dayTasks => dayTasks.length > 0) ?
                <div>
                  {untimedTasks.map((dayTasks) => {
                    return (
                      <div>
                        {dayTasks.map((task, index) => {
                          return (
                            <div>
                              {index === 0 && <span className="d-flex mt-3 mb-2 fw-semibold text-secondary">{formatDate(task.date, true)}</span>}
                              <UntimedTasksList task={task} onTaskClick={handleOpenTask} />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                : <span className="d-flex my-2 text-secondary">No untimed task this week</span>
              }
            </div>
          </div>
        </div>
      </div>

      {/* CRUD POPUP */}
      <CRUD isOpen={crudOpen} onClose={() => setCrudOpen(false)} mode="read" selectedTaskId={taskId} />
    </div>
  );
}

export default WeekView;