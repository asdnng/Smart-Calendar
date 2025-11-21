import { BsCalendarPlus, BsCardList, BsViewList, BsLayoutThreeColumns, BsCalendar3, BsBoxArrowRight  } from 'react-icons/bs';

import '../cssModules/menu.css';

function Menu({ isOpen, onClose, onChat, onAdd, onList, onDay, onWeek, onMonth, onSetting, onLogout }) {
  const opt = "d-flex w-100 px-3 py-2 border-0 text-decoration-none align-items-center text-start text-white";
  const logoutOpt = "d-flex w-100 px-3 py-2 border-0 text-decoration-none align-items-center justify-content-center text-center fw-semibold ";

  const handleClick = (e) => {
    if (e.target.tagName === "BUTTON") { onClose(); }
  };

  return (
    <>
      <div className={`menu-overlay ${isOpen ? "open" : ""}`} onClick={onClose}></div>
      {/* MENU PANEL */}
      <div className={`menu-panel ${isOpen ? "open" : ""}`}>
        <h5 className="text-center fw-bold mb-3 ps-5 pb-2">MyGil</h5>
        <ul className="list-unstyled" onClick={handleClick}>
          {/* CHAT OPTION */}
          <li>
            <button className={opt} onClick={onChat}>
              Chat
            </button>
          </li>
          <hr className="flex-grow-1 m-2 me-4" />

          {/* ADD TASK OPTION */}
          <li>
            <button className={opt} onClick={onAdd}>
              <BsCalendarPlus className="me-3" />
              Add task
            </button>
          </li>

          <p className="px-3 mt-3 mb-1 text-secondary fw-semibold">View</p>
          {/* VIEW OPTIONS */}
          <li>
            <button className={opt} onClick={onList}>
              <BsCardList className="me-3" />
              Task list
            </button>
          </li>
          <li>
            <button className={opt} onClick={onDay}>
              <BsViewList className="me-3" />
              Day
            </button>
          </li>
          <li>
            <button className={opt} onClick={onWeek}>
              <BsLayoutThreeColumns className="me-3" />
              Week
            </button>
          </li>
          <li>
            <button className={opt} onClick={onMonth}>
              <BsCalendar3 className="me-3" />
              Month
            </button>
          </li>
          <hr className="flex-grow-1 m-2 me-4" />

          <li><button className={opt} onClick={onSetting}>Setting</button></li>

          <li>
            <button className={`${logoutOpt} logout mt-3`} onClick={onLogout}>
              <BsBoxArrowRight className="me-2" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Menu;
