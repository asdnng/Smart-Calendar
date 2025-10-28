import { createContext, useContext, useState, useEffect, useCallback  } from 'react';
import api from '../axiosSetup.js';
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
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data || []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = async (task) => {
    try {
      const res = await api.post('/tasks', task);
      setTasks((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Add task failed:', err);
      alert('Failed to save task. Please try again.');
    }
  };

  const getTask = (id) => tasks.find((t) => t.id === id);

  const editTask = async (id, updatedData) => {
    try {
      const res = await api.put(`/tasks/${id}`, updatedData);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update task.');
    }
  };

  const removeTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete task.');
    }
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