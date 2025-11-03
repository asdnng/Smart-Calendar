import { createContext, useContext, useState, useEffect, useCallback  } from 'react';

import api from '../axiosSetup.js';
import Loading from './loading.js';

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

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data || []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // for testing frontend
  // const addTask = (task) => setTasks([...tasks, task]);
  const addTask = async (task) => {
    try {
      setIsLoading(true);
      const res = await api.post('/tasks', task);
      setTasks((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Add task failed:', err);
      alert('Failed to save task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTask = (id) => tasks.find((t) => t.id === id);

  // for testing frontend
  // const editTask = (id, updatedData) => {
  //   setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedData } : t));
  // };
  const editTask = async (id, updatedData) => {
    try {
      setIsLoading(true);
      const res = await api.put(`/tasks/${id}`, updatedData);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update task.');
    } finally {
      setIsLoading(false);
    }
  };

  // for testing frontend
  // const removeTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const removeTask = async (id) => {
    try {
      setIsLoading(true);
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete task.');
    } finally {
      setIsLoading(false);
    }
  };

  const getReversedTasks = () => tasks.slice().reverse();
  const getSortedTasks = () => tasks.slice().sort(sortTasks);

  const getFilteredTasks = (tasksArr, selection) => {
    if (!Object.values(selection).some(val => val.length > 0)) return tasksArr;

    return tasksArr.filter(task => {  // for each task
      return Object.keys(selection).every(key => {  // consider each state
        return selection[key].includes(String(task[key]));  // check if task value exists in selected state values
      });
    });
  };

  return (
    <TasksContext.Provider 
      value={{ 
        tasks, 
        addTask, 
        getTask, 
        editTask, 
        removeTask, 
        tasksByDate: getSortedTasks, 
        tasksByRecency: getReversedTasks,
        getFilteredTasks }}
    >
      {isLoading && 
        <Loading />
      }

      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);