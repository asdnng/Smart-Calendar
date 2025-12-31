import { useEffect, useState } from 'react';

import { useTasks } from '../Tasks';
import { getTodayDateString as todayDate, getDateString as dateString } from './uitilities/Date';
import { ViewHeader, useScheduleLogic, UntimedTasksList, daysInWeek } from './uitilities/schedule';
import { taskBgColor } from '../Categories';
import CRUD from '../crud/crud';

import '../../cssModules/views/month.css';

const getOrdinal = (n) => {
  const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });
  const suffixes = {
    one: 'st',
    two: 'nd',
    few: 'rd',
    other: 'th',
  };
  return suffixes[pr.select(n)];
};

function monthGridDays(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = new Date(firstDayOfMonth);
  startDay.setDate(startDay.getDate() - (startDay.getDay() % 7));

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(startDay);
    date.setDate(startDay.getDate() + i);
    return date;
  });
}

function MonthView() {
  const { tasks, tasksByDate } = useTasks();
    
  const {
    selectedDate, setSelectedDate, isToday, goToToday,
    taskId, crudOpen, setCrudOpen, handleOpenTask
  } = useScheduleLogic();

  const [selectedMonth, setSelectedMonth] = useState(todayDate(false));
  const [year, month] = selectedMonth.split("-").map(Number);
  const days = monthGridDays(year, month - 1);
  const dateNumber = Number(selectedDate.split("-")[2]);

  /* TASKS STATE */
  const [dateTasks, setDateTasks] = useState([]);
  const [monthTasks, setMonthTasks] = useState([]);
  const hasTasks = tasks.length > 0 && monthTasks.length > 0;

  useEffect(() => {
    const newMonthTasks = tasksByDate().filter(task => task.date.startsWith(selectedMonth));
    const newDateTasks = newMonthTasks.filter(task => task.date === selectedDate);

    setMonthTasks(newMonthTasks);
    setDateTasks(newDateTasks);
  }, [selectedMonth, selectedDate, tasksByDate]);

  const handleGoToToday = () => {
    setSelectedMonth(todayDate(false));
    goToToday();
  };

  const handleClickDate = (date) => {
    setSelectedMonth(dateString(date, false));
    setSelectedDate(dateString(date, true));
  };

  const handleChangeMonth = (val) => {
    setSelectedMonth(val);
    setSelectedDate(`${selectedMonth}-01`);
  };

  const isInSelectedMonth = (date) => date.getMonth() === month - 1;
  const isSelectedDate = (date) => date.getDate() === dateNumber && isInSelectedMonth(date);
  const isTodayDate = (date) => dateString(date, true) === todayDate();

  return (
    <div className="monthview-container d-flex">
      {/* TOP BAR */}
      <ViewHeader 
        hasTasks={hasTasks} 
        emptyLabel={"No task this month"} 
        isToday={isToday} 
        onGoToToday={handleGoToToday} 
        inputType={"month"}
        selectedOpt={selectedMonth} 
        onOptChange={handleChangeMonth} 
      />

      <div className="monthview-content d-flex col">
        {/* CALENDAR SECTION */}
        <div className="month-calendar-section col-8 bg-white">
          {/* WEEKDAY LABELS */}
          <div className="month-weekdays py-2 pt-3 bg-dark fw-semibold text-light text-center">
            {daysInWeek.map(d => (
              <div key={d} className="weekday text-center">{d}</div>
            ))}
          </div>

          {/* MONTH GRID */}
          <div className="monthview-grid">
            {days.map(date => {
              const dateKey = dateString(date, true);
              const dayTasks = monthTasks.filter(task => task.date === dateKey) || [];

              return (
                <div
                  key={dateKey}
                  className={`day-cell ${!isInSelectedMonth(date) ? "date-outside-month" : ""}`}
                >
                  <div className="calendar-date d-flex fw-semibold">
                    <div 
                      className={`number cursor-pointer ${isTodayDate(date) && !isSelectedDate(date) ? "text-white" : ""}`}
                      onClick={() => handleClickDate(date)}
                    >
                      {date.getDate()}
                    </div>
                    {/* Circle on Date */}
                    <span 
                      className={`${isSelectedDate(date) ? "selected-date" : `${isTodayDate(date) ? "today" : ""}` }`}
                    ></span>
                  </div>

                  <div className="day-tasks position-absolute">
                    {dayTasks.slice(0, 1).map(task => (
                      <div 
                        key={task.id} 
                        className="task cursor-pointer" 
                        style={{ backgroundColor: `${taskBgColor(task, 0.5)}` }}
                        onClick={() => handleOpenTask(task.id)}
                      >
                        {task.taskName}
                      </div>
                    ))}

                    {dayTasks.length > 1 && (
                      <div className="text-secondary">
                        +{dayTasks.length - 1} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DAY TASKLIST SECTION */}
        <div className="date-tasklist-section col-4 bg-light border-start">
          <div className="title d-flex bg-dark text-light fw-semibold">
            Tasks on {dateNumber}{getOrdinal(dateNumber)}
          </div>

          <div className="date-tasklist-content px-4 bg-light">
            {dateTasks.length === 0 ?
              <div className="d-flex flex-grow-1 pt-4 justify-content-center text-secondary fw-semibold">
                <p>No task</p>
              </div>
              : 
              <div className="date-tasklist row pt-2 justify-content-center">
                {dateTasks.map((task) => {
                  return (
                    <UntimedTasksList task={task} onTaskClick={handleOpenTask} />
                  );
                })}
              </div>
            }
          </div>
        </div>
      </div>

      {/* CRUD POPUP */}
      <CRUD isOpen={crudOpen} onClose={() => setCrudOpen(false)} mode="read" selectedTaskId={taskId} />
    </div>
  );
}

export default MonthView;