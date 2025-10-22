import { createContext, useContext, useState } from 'react';

const TasksContext = createContext();

// data currently temporary, later integrate with database (backend) to become permanent
export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => setTasks([...tasks, task]);
  const getTask = (id) => tasks.find(t => t.id === id );
  const removeTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const editTask = (id, updatedData) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, getTask, editTask, removeTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);