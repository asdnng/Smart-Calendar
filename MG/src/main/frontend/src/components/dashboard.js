import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import { BsPatchPlusFill } from 'react-icons/bs';

import { TasksProvider } from './Tasks.js';
import Menu from './menu.js';
import CRUD from './crud/crud.js';

import '../cssModules/dashboard.css';
import '../cssModules/menu.css';

function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [crudOpen, setCrudOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <TasksProvider>
      <div className="vh-100 d-flex flex-column">
        {/* HEADER */}
        <div className="dashboard-header row text-white m-0 p-4 align-items-center">
          <div className="col-6"></div>
          <div className="col-6 text-end">
            <p className="mb-0">Hi Gyeong :D/</p>
          </div>
        </div>

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
          onChat={() => navigate("chat")}
          onAdd={() => setCrudOpen(true)}
          onList={() => navigate("view/list")}
          onDay={() => navigate("view/day")}
          onWeek={() => navigate("view/week")}
          onMonth={() => navigate("view/month")}
        />

        {/* PLACEHOLDER WHERE CHILDREN ROUTES APPEAR */}
        <Outlet />

        {/* ADD TASK SHORTCUT BUTTON */}
        {location.pathname !== "/dashboard/chat" &&
          <button onClick={() => setCrudOpen(true)} className="add-task-btn mb-4 me-4">
            <BsPatchPlusFill />
          </button>
        }

        {/* CRUD POPUP */}
        <CRUD isOpen={crudOpen} onClose={() => setCrudOpen(false)} mode="create" />
      </div>
    </TasksProvider>
  );
}

export default DashboardPage;