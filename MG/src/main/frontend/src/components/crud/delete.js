import { useState } from 'react';

import { BsTrashFill } from 'react-icons/bs';

import Alert from '../alert.js';

function DeleteTask({ selectedAll, onSelectAll, onDeleteTasks, selectedTasksNum }) {
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    await onDeleteTasks();
  };

  return (
    <div className="d-flex">
      <button
        className="select-all btn me-3 px-3 py-1 bg-light rounded-pill fw-semibold"
        onClick={onSelectAll}
        disabled={selectedAll}
      >
        Select all
      </button>

      <button
        className="delete-tasks btn bg-black text-white"
        onClick={() => setShowConfirm(true)}
        disabled={selectedTasksNum === 0}
      >
        <BsTrashFill />
      </button>

      {showConfirm &&
        <Alert
          isOpen={showConfirm}
          message={`Delete ${selectedAll ? "all tasks" : selectedTasksNum + " task(s)"}? This cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      }
    </div>
  );
}

export default DeleteTask;