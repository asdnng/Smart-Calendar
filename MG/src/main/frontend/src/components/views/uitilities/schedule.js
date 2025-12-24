// Reusable COMPONENTS for view pages

import { useState, useEffect } from 'react';

import { BsFillCalendarCheckFill } from 'react-icons/bs';

import { changeColorOpacity as newColorOpacity, taskCategoryColor } from '../../Categories';
import { getTodayDateString as todayDate, getTodayCurrentMinutes as todayTime } from './Date';

import '../../../cssModules/views/schedule.css';

const hours = [...Array(24)].map((_, i) => i);

export const ViewHeader = ({ hasTasks, emptyLabel, isToday, onGoToToday, inputType, selectedOpt, onOptChange }) => (
  /* TOP BAR -> date selection */
  <div className="topbar bg-light d-flex px-3 py-2 fw-bold">
    <span className="d-flex flex-grow-1 align-items-center">
      {!hasTasks && emptyLabel}
    </span>
    <span className="d-flex align-items-center justify-content-end">
      {isToday ? 
        <span className="me-3 fw-semibold text-secondary">Today</span> :
        <BsFillCalendarCheckFill className="me-3 fs-4 cursor-pointer" onClick={onGoToToday} />
      }
      <input 
        type={inputType}
        className="form-control me-2 cursor-pointer rounded-pill"
        value={selectedOpt}
        onChange={(e) => onOptChange(e.target.value)}
      />
    </span>
  </div>
);

export const HoursLabels = ({ pxScale }) => (
  <div className={`hour-labels-container col-${pxScale} bg-dark text-center text-light fw-semibold`}>
    {hours.map((h) => (
      <div 
        key={h} 
        className="hour-label bg-dark"
        style={{ height: `${pxScale * 60}px`, fontSize: `${pxScale + 11}px` }}
      >
        {String(h).padStart(2, "0")}:00
      </div>
    ))}
  </div>
);

export const TimelineGrid = ({ pxScale, today }) => (
  <>
    {/* TIME GRID */}
    {hours.map((h) => (
      <div 
        key={h} 
        className="timeline-hour"
        style={{ height: `${pxScale * 60}px`, backgroundColor: `${today ? "rgba(243, 235, 235, 0.3)" : "white"}` }}
      >
      </div>
    ))}

    {/* 10 MINUTES LINE */}
    {Array.from({ length: 24 * 6 }).map((_, i) => (
      <div
        key={i}
        className="ten-minute-line position-absolute"
        style={{ top: i * 10 * pxScale }}
      >
      </div>
    ))}
  </>
);

export const CurrentTimeBar = ({ pxScale, currMinutes, withText }) => {
  const timeBar = pxScale * currMinutes;
  const lineStyle = "dotted rgba(121, 164, 179, 1)";

  return (
    <div
      className="current-time-bar position-absolute pe-3 text-end"
      style={{ top: timeBar, borderTop: `${pxScale === 1 ? "1.5" : pxScale}px ${lineStyle}` }}
    >
      {withText ? "CURRENT TIME" : ""}
    </div>
  );
};

export const TaskBlock = ({ task, style, onClick, className = "" }) => {
  const bgColor = newColorOpacity(taskCategoryColor(task.category), 0.65);

  return (
    <div
      className={`task-block cursor-pointer ${className}`}
      style={{ ...style, backgroundColor: bgColor }}
      onClick={() => onClick(task.id)}
    >
      <strong>{task.taskName}</strong><br />
      {task.endTime ? 
        `${task.startTime} - ${task.endTime}` :  
        `${task.startTime ? `At ${task.startTime}` : ""}`
      }
    </div>
  );
};

export const TimedTasksColumn = ({ tasks, onTaskClick, padding, pxScale, changeSize = false }) => (
  <>
    {tasks.map((task) => (
      <TaskBlock
        key={task.id}
        task={task}
        onClick={onTaskClick}
        className={`position-absolute ${padding}`}
        style={{
          top: task.start * pxScale,
          height: (task.end - task.start) * pxScale,
          left: `${(100 / task.totalCols) * task.column}%`,
          width: `${100 / task.totalCols}%`,
          fontSize: `${changeSize ? `${task.totalCols < 2 ? 11 : 7}px` : ""}`
        }}
      />
    ))}
  </>
);

export const UntimedTasksList = ({ task, onTaskClick }) => {
  const className = "mb-1 px-3 py-2 rounded-3 text-dark";

  return (
    <TaskBlock
      key={task.id}
      task={task}
      onClick={onTaskClick}
      className={className}
    />
  );
};

export function useScheduleLogic() {
  const [selectedDate, setSelectedDate] = useState(todayDate());
  const [currentMinutes, setCurrentMinutes] = useState(todayTime());
  const [taskId, setTaskId] = useState(null);
  const [crudOpen, setCrudOpen] = useState(false);

  useEffect(() => {
    setCurrentMinutes(todayTime());

    const intervalTime = setInterval(() => {
      setCurrentMinutes(todayTime());
    }, 60000);

    return () => clearInterval(intervalTime);
  }, []);

  const goToToday = () => setSelectedDate(todayDate());

  const handleOpenTask = (id) => {
    setCrudOpen(true);
    setTaskId(id);
  };

  return {
    selectedDate, setSelectedDate,
    currentMinutes,
    taskId,
    crudOpen, setCrudOpen,
    handleOpenTask,
    goToToday,
    isToday: selectedDate === todayDate()
  };
}