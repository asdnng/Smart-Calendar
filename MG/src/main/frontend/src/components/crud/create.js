import { BsTrash } from 'react-icons/bs';

import { useTaskForm } from './Form.js';
import TaskFormFields from './Form.js';

function CreateTask({ add, onClose, onAlert }) {
  const { 
    formData, timeError, checkTime, resetForm,
    handleDataChange, handleCategoryChange 
  } = useTaskForm();

  const handleDeleteClick = () => {
    // check if any data exists
    const hasData = Object.values(formData).some(value => value);
    if (hasData) { 
      onAlert(
        "Delete the task? Input will be lost.",
        () => resetForm(onClose)
      ); 
    } else { resetForm(onClose); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkTime()) return;

    const newTask = {
      id: Date.now(),
      ...formData
    };

    add(newTask);
    resetForm(onClose);
  };

  return (
    <>
      {/* DELETE BUTTON */}
      <button
        className="delete-task btn px-2 pt-0 pb-1"
        onClick={handleDeleteClick}
      >
        <BsTrash />
      </button>

      {/* CRUD FORM */}
      <form className="crud-form mt-4" onSubmit={handleSubmit}>
        <TaskFormFields 
          formData={formData}
          timeError={timeError}
          handleDataChange={handleDataChange}
          handleCategoryChange={handleCategoryChange}
        />

        {/* SUBMIT BUTTON (add) */}
        <div className="d-flex justify-content-center mt-3">
          <button type="submit" className="submit-crud px-4 py-2">Add</button>
        </div>
      </form>   
    </>
  );
}

export default CreateTask;