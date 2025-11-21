import { useState, useCallback } from 'react';

import SelectCategory from '../Categories';

const initialTaskStates = {
  taskName: "",
  category: "",
  date: "",
  startTime: "",  // user optional
  endTime: "",  // user optional
  description: ""  // user optional
};

export const useTaskForm = (initialTask = initialTaskStates) => {
  const [formData, setFormData] = useState(initialTask);  // single state for task variables
  const [timeError, setTimeError] = useState("");
  
  const handleDataChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value}));
    if (name === "startTime" || name === "endTime") {
      setTimeError("");  // clear time error on change
    }
  }, []);

  const handleCategoryChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, category: value }));
  }, []);

  const checkTime = useCallback(() => {
    const { startTime, endTime } = formData;
    if (endTime && !startTime) {
      setTimeError("Start time is required if end time exists");
      return false;
    } else if (startTime && endTime && (endTime < startTime)) {
     setTimeError("Fill earlier start time or later end time");
     return false;
    } else if (startTime && endTime && (endTime === startTime)) {
     setTimeError("Fill later end time or remove end time");
     return false;
    } else return true;
  }, [formData]);

  const resetForm = useCallback((onClose) => {
    setFormData(initialTask);
    setTimeError("");
    if (onClose) onClose();
  }, [initialTask]);

  return {
    formData, setFormData,
    timeError, setTimeError,
    handleDataChange,
    handleCategoryChange,
    checkTime,
    resetForm
  };
};

function TaskFormFields({ formData, handleDataChange, handleCategoryChange, timeError }) {
  return (
    <>
      {/* TASK NAME */}
      <input
        type="text"
        className="form-control"
        placeholder="Task name"
        name="taskName"
        value={formData.taskName}
        onChange={handleDataChange}
        required
      />

      {/* CATEGORY SELECTION */}
      <SelectCategory
        selected={formData.category}
        onSelect={handleCategoryChange}
      />

      {/* DATE */}
      <input
        type="date"
        className="form-control"
        name="date"
        value={formData.date}
        onChange={handleDataChange}
        required
      />

      {/* OPTIONAL DIVIDER */}
      <div className="d-flex align-items-center">
        <hr className="flex-grow-1" />
        <span className="mx-3 text-secondary">Optional</span>
        <hr className="flex-grow-1" />
      </div>

      {/* TIME */}
      <div>
        <div className="d-flex align-items-center">
          <input
            type="time"
            className={`form-control ${timeError ? "time-error" : ""}`}
            name="startTime"
            value={formData.startTime}
            onChange={handleDataChange}
          />
          <span className="mx-2">til</span>
          <input
            type="time"
            className={`form-control ${timeError ? "time-error" : ""}`}
            name="endTime"
            value={formData.endTime}
            onChange={handleDataChange}
          />
        </div>

        {timeError && (
          <p className="text-danger mt-1 mb-0">{timeError}</p>
        )}
      </div>

      {/* TASK DESCRIPTION */}
      <div className="form-description">
        <label htmlFor="task-description">Description</label>
        <textarea
          className="form-control"
          id="task-description"
          rows="3"
          name="description"
          value={formData.description}
          onChange={handleDataChange}
        >
        </textarea>
      </div>
    </>
  );
}

export default TaskFormFields;