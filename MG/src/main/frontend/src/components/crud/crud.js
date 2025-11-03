import { useState, useEffect } from 'react';

import { useTasks } from '../Tasks.js';
import CreateTask from './create.js';
import ReadTask from './read.js';
import UpdateTask from './update.js';
import Switcher from '../switcher.js';
import Alert from '../alert.js';

import '../../cssModules/crud.css';

function CRUD({ isOpen, onClose, mode, selectedTaskId = null }) {
  const { addTask, getTask, editTask, removeTask } = useTasks();
  const [crudMode, setCrudMode] = useState(mode);  // mode: create | read | update [+ delete]
  const [isEdit, setIsEdit] = useState(false);
  const [disabledSwitch, setDisabledSwitch] = useState(false);
  /* ALERT CONFIRMATION VARIABLES */
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => () => {});  // store function to run on confirm

  const triggerAlert = (msg, actionToDo) => {
    setConfirmMessage(msg);
    setConfirmAction(() => actionToDo);  // store function reference
    setShowConfirm(true);
  };

  const handleConfirmAlert = () => {
    setShowConfirm(false);
    confirmAction();
  };

  const handleCancelAlert = () => {
    setShowConfirm(false);
    setConfirmAction(() => () => {});  // clear action
  };

  useEffect(() => {
    setIsEdit(false);
    setDisabledSwitch(false);
  }, [editTask, removeTask]);

  useEffect(() => {
    if (crudMode !== "create") {
      setCrudMode(isEdit ? "update" : "read");
    }
  }, [isEdit, crudMode]);

  if (!isOpen) return null;

  const currTask = selectedTaskId ? getTask(selectedTaskId) : null;

  return (
    <div className="crud-overlay">
      <div className="crud-popup">
        {/* CREATE MODE */}
        {crudMode === "create" && (
          <CreateTask add={addTask} onClose={onClose} onAlert={triggerAlert} />
        )}

        {/* READ/EDIT MODE TOGGLE (switcher) */}
        {crudMode !== "create" && (
          <div className="crud-switcher">
            <Switcher 
              switched={isEdit} 
              onSwitched={() => setIsEdit((prev) => !prev)} 
              blocked={disabledSwitch}
              defaultText="Read"
              text="Edit"
              hasIcon={true}
            />
          </div>
        )}

        {/* READ MODE */}
        {crudMode === "read" && currTask && (
          <ReadTask task={currTask} onClose={onClose} />
        )}

        {/* UPDATE AND DELETE MODE */}
        {crudMode === "update" && currTask && (
          <UpdateTask
            taskId={selectedTaskId}
            task={currTask}
            edit={editTask}
            remove={removeTask}
            onBlock={setDisabledSwitch}
            onClose={onClose}
            onAlert={triggerAlert}
          />
        )}
      </div>

      {/* ALERT POPUP */}
      <Alert
        isOpen={showConfirm}
        message={confirmMessage}
        onConfirm={handleConfirmAlert}
        onCancel={handleCancelAlert}
      />
    </div>
  );
}

export default CRUD;