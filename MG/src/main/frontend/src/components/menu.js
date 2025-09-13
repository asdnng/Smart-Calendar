import "../cssModules/menu.css";

import { BsCalendarPlus } from "react-icons/bs";
import { BsCardList } from "react-icons/bs";
import { BsViewList } from "react-icons/bs";
import { BsLayoutThreeColumns } from "react-icons/bs";
import { BsCalendar3 } from "react-icons/bs";

function Menu({ isOpen, onClose }) {
  const optionBlock = "d-flex w-100 px-3 py-2 text-white text-decoration-none align-items-center";

  const handleClick = (e) => {
    if (e.target.tagName === "A") { onClose(); }
  };

  return (
    <div className={`menu-panel ${isOpen ? "open" : ""}`}>
      <h5 className="text-end mb-4 pe-4 pb-2">MG project</h5>
      <ul className="list-unstyled" onClick={handleClick}>
        {/* CHAT OPTION */}
        <li><a href="#chat" className={optionBlock}>Chat</a></li>
        <hr className="flex-grow-1 m-2 me-4" />

        {/* ADD TASK OPTION */}
        <li>
          <a href="#add" className={optionBlock}>
            <BsCalendarPlus className="me-3" />
            Add task
          </a>
        </li>

        <p className="px-3 mt-3 mb-1 text-secondary fw-semibold">View</p>
        {/* VIEW OPTIONS */}
        <li>
          <a href="#list" className={optionBlock}>
            <BsCardList className="me-3" />
            Task list
          </a>
        </li>
        <li>
          <a href="#day" className={optionBlock}>
            <BsViewList className="me-3" />
            Day
          </a>
        </li>
        <li>
          <a href="#week" className={optionBlock}>
            <BsLayoutThreeColumns className="me-3" />
            Week
          </a>
        </li>
        <li>
          <a href="#month" className={optionBlock}>
            <BsCalendar3 className="me-3" />
            Month
          </a>
        </li>
        <hr className="flex-grow-1 m-2 me-4" />

        <li><a href="#sync" className={optionBlock}>Sync</a></li>
        <li><a href="#account" className={optionBlock}>Account</a></li>
        <li><a href="#setting" className={optionBlock}>Setting</a></li>
      </ul>
    </div>
  );
}

export default Menu;
