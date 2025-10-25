import { createContext, useContext, useState } from 'react';

const TasksContext = createContext();

const sortTasks = (a, b) => {
  if (a.date < b.date) return -1;
  if (a.date > b.date) return 1;

  const sTimeA = a.startTime || '99:99';
  const sTimeB = b.startTime || '99:99';
  if (sTimeA < sTimeB) return -1;
  if (sTimeA > sTimeB) return 1;

  const eTimeA = a.endTime || '99:99';
  const eTimeB = b.endTime || '99:99';
  if (eTimeA < eTimeB) return -1;
  else if (eTimeA > eTimeB) return 1;

  return 0;
};

// data currently temporary, later integrate with database (backend) to become permanent
export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => setTasks([...tasks, task]);
  const getTask = (id) => tasks.find(t => t.id === id );
  const removeTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const editTask = (id, updatedData) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  const getReversedTasks = () => tasks.slice().reverse();
  const getSortedTasks = () => tasks.slice().sort(sortTasks);

  return (
    <TasksContext.Provider 
      value={{ 
        tasks, 
        addTask, 
        getTask, 
        editTask, 
        removeTask, 
        tasksByDate: getSortedTasks, 
        tasksByRecency: getReversedTasks }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);