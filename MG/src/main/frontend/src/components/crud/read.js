import { BsXCircleFill, BsBookmarkFill, BsCalendarFill, BsClockFill } from 'react-icons/bs';

import { Categories } from '../Categories';

function formatDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function ReadTask({ task, onClose }) {
  const normalizedCategory = task.category ? task.category.toLowerCase() : null;
  const taskCategory = Categories.find((c) => c.value === normalizedCategory);
  const fallbackCategory = Categories.find((c) => c.value === "other") || { label: "Other", color: "rgba(130, 130, 130, 1)" };
  const categoryColor = taskCategory?.color || fallbackCategory.color;
  const categoryLabel = taskCategory?.label || fallbackCategory.label;

  return ( 
    <>
      {/* CLOSE BUTTON */}
      <button
        className="close-task btn px-2 py-0"
        onClick={onClose}
      >
        <BsXCircleFill />
      </button>

      {/* CRUD SECTION */}
      <div className="pt-4">
        {/* TASK NAME */}
        <h4 className="mb-3">{task.taskName}</h4> 

        {/* CATEGORY */}
        <div className="d-flex mb-4 p-2 bg-light rounded-pill align-items-center">
          <BsBookmarkFill
            className="ms-3 me-3"
            size={20}
            style={{ color: categoryColor }}
          />
          {categoryLabel}
        </div>

        {/* DATE */}
        <div 
          className="d-flex mb-1 fw-bold align-items-center"
          style={{ color: "rgba(28, 52, 84, 1)" }}
        >
          <BsCalendarFill className="me-3" size={16} />
          {formatDate(task.date)}
        </div>
        
        {/* TIME */}
        <div 
          className="d-flex mb-3 fw-semibold align-items-center"
          style={{ color: "rgba(28, 52, 84, 1)" }}
        >
          <BsClockFill className="me-3" size={16} />
          {task.startTime &&
            <div>
              {task.startTime}
              {task.endTime ? ` - ${task.endTime}` : ""}
            </div>
          }
          {!task.startTime && <div>-- : --</div>} 
        </div>

        {/* TASK DESCRIPTION */}
        <p>{task.description}</p>
      </div>
    </>
  );
}

export default ReadTask;