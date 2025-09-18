import { useState } from 'react';

import { BsPatchPlusFill } from 'react-icons/bs';

import Header from './header.js';
import Body from './body.js';
import Menu from './menu.js';
import CRUD from './crud.js';
import Chat from './chat.js';
import TaskList from './views/tasklist.js';
import DayView from './views/day.js';
import WeekView from './views/week.js';
import MonthView from './views/month.js';

import '../cssModules/dashboard.css';
import '../cssModules/menu.css';

function DashboardPage({ inPage, onChange }) {
  const [activePage, setActivePage] = useState("body");
  const [menuOpen, setMenuOpen] = useState(false);
  const [crudOpen, setCrudOpen] = useState(false);

  return (
    <div className="vh-100 d-flex flex-column bg-light">
      {/* MENU BUTTON */}
      <button className="menu-toggle-btn btn p-0" onClick={() => setMenuOpen(!menuOpen)}>
        <img
          src="/MG-logo.png"
          alt="MG"
          style={{ width: "50px" }}
        />
      </button>

      {/* MENU PANEL */}
      <Menu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onChat={() => setActivePage("chat")}
        onAdd={() => setCrudOpen(true)}
        onList={() => setActivePage("list")}
        onDay={() => setActivePage("day")}
        onWeek={() => setActivePage("week")}
        onMonth={() => setActivePage("month")}
      />

      <Header />

      {activePage === "body" && <Body />}
      {activePage === "chat" && <Chat />}
      {activePage === "list" && <TaskList />}
      {activePage === "day" && <DayView />}
      {activePage === "week" && <WeekView />}
      {activePage === "month" && <MonthView />}

      {/* ADD TASK SHORTCUT BUTTON */}
      {activePage !== "chat" &&
        <button onClick={() => setCrudOpen(true)} className="add-task-btn mb-4 me-4">
          <BsPatchPlusFill />
        </button>
      }

      {/* CRUD POPUP */}
      <CRUD isOpen={crudOpen} onClose={() => setCrudOpen(false)} />
    </div>
  );
}

export default DashboardPage;