import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import { BsChevronRight } from 'react-icons/bs';

import { UserProvider } from '../User';

import '../../cssModules/setting.css';

function Setting() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="setting content bg-secondary">
      <h2 className="d-flex my-3 ms-4 text-light fw-semibold">
        Setting
      </h2>

      {location.pathname === "/dashboard/setting" &&
        <div className="setting-options d-flex flex-grow-1 row mx-3 bg-light rounded-4 border">
          <button 
            className="btn top d-flex py-2 border-bottom rounded-0"
            onClick={() => navigate("account")}
          >
            <span className="col-6 ps-3 text-start fw-semibold">Account</span>
            <span className="col-6 pe-3 text-end"><BsChevronRight /></span>
          </button>
          <button 
            className="btn bottom d-flex py-2 rounded-0"
            onClick={() => navigate("taskCategories")}
          >
            <span className="col-6 ps-3 text-start fw-semibold">Task categories</span>
            <span className="col-6 pe-3 text-end"><BsChevronRight /></span>
          </button>
        </div>
      }

      <UserProvider>
        <Outlet />
      </UserProvider>
    </div>
  );
}

export default Setting;