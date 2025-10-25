import { useEffect } from 'react';

import { BsTrashFill } from 'react-icons/bs';

import { useTaskForm } from './Form.js';
import TaskFormFields from './Form.js';

function UpdateTask({ taskId, task, edit, remove, onBlock, onClose, onAlert }) {
  const { 
    formData, setFormData, timeError, checkTime,
    handleDataChange, handleCategoryChange 
  } = useTaskForm(task);

  // check if any data changed
  const hasChanges = Object.keys(formData).some(key => formData[key] !== task[key]);

  useEffect(() => {
    onBlock(hasChanges);
  }, [hasChanges, onBlock]);

  const handleUndo = (e) => {
    e.preventDefault();
    setFormData(task);
    onBlock(false);
  };

  const handleRemoveClick = () => {
    onAlert(
      "Remove the task? This cannot be undone.",
      () => {
        remove(taskId);
        onClose();
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkTime()) return;

    const updatedData = {};
    for (const key in formData) {
      if (task.hasOwnProperty(key)) {  // ensure that the keys exist and not being inherited
        if (formData !== task[key]) updatedData[key] = formData[key];
      }
    }

    edit(taskId, updatedData);
  };

  return (
    <>
      {/* REMOVE BUTTON */}
      <button
        className="remove-task btn px-2 pt-0 pb-1"
        onClick={handleRemoveClick}
      >
        <BsTrashFill />
      </button>

      {/* CRUD FORM */}
      <form className="crud-form mt-4" onSubmit={handleSubmit}> 
        <TaskFormFields 
          formData={formData}
          timeError={timeError}
          handleDataChange={handleDataChange}
          handleCategoryChange={handleCategoryChange}
        />
        
        {/* SUBMIT (update) AND UNDO BUTTON */}
        {hasChanges && 
          <div className="d-flex justify-content-center mt-3">
            <button className="undo-crud btn me-3 px-4 py-2 fw-semibold" onClick={handleUndo}>Undo</button>
            <button type="submit" className="submit-crud px-4 py-2">Update</button>
          </div>
        }
      </form>
    </>
  );
}

export default UpdateTask;