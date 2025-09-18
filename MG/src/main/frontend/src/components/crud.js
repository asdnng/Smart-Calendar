import { useState } from 'react';

import { BsFillTrashFill } from 'react-icons/bs';

import SelectCategory from './categories.js';
import Alert from './alert.js';

import '../cssModules/crud.css';

function CRUD({ isOpen, onClose }) {
  /* TASK INPUTS VARIABLES */
  const [taskName, setTaskName] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState(""); // user optional
  const [endTime, setEndTime] = useState(""); // user optional
  const [description, setDescription] = useState(""); // user optional
  /* ALERT CONFIRMATION VARIABLE */
  const [showConfirm, setShowConfirm] = useState(false);

  const resetForm = () => {
    setTaskName("");
    setCategory("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setDescription("");
  };

  const handleDeleteClick = () => {
    const hasData = taskName || category || date || startTime || endTime || description;
    if (hasData) { setShowConfirm(true); }
    else { onClose(); }
  };

  const confirmDelete = () => {
    resetForm();
    setShowConfirm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="crud-overlay">
      <div className={"crud-popup"}>
        {/* DELETE BUTTON */}
        <button
          className="delete-task btn px-2 pt-0 pb-1"
          onClick={handleDeleteClick}
        >
          <BsFillTrashFill />
        </button>

        {/* CRUD FORM */}
        <form className="crud-form mt-4">
          {/* TASK NAME */}
          <input
            type="text"
            className="form-control"
            placeholder="Task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />

          {/* CATEGORY SELECTION */}
          <SelectCategory
            selected={category}
            onSelect={(val) => setCategory(val)}
          />

          {/* DATE */}
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          {/* OPTIONAL DIVIDER */}
          <div className="d-flex align-items-center">
            <hr className="flex-grow-1" />
            <span className="mx-3 text-secondary">Optional</span>
            <hr className="flex-grow-1" />
          </div>

          {/* TIME */}
          <div className="d-flex align-items-center">
            <input
              type="time"
              className="form-control"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <span className="mx-2">til</span>
            <input
              type="time"
              className="form-control"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          {/* TASK DESCRIPTION */}
          <div className="form-description">
            <label htmlFor="task-description">Description</label>
            <textarea
              className="form-control"
              id="task-description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            >
            </textarea>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="d-flex justify-content-center mt-3">
            <button type="submit" className="submit-crud px-4 py-2">Add</button>
          </div>
        </form>
      </div>

      {/* ALERT POPUP */}
      <Alert
        isOpen={showConfirm}
        message="Input will be lost. Delete the task?"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}

export default CRUD;