import { useState } from 'react';

import '../cssModules/menu.css'

import Menu from './menu.js';
import Header from './header.js';
import Body from './body.js';

import projectLogo from '../assets/emoji.png'

function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="container-fluid vh-100 d-flex flex-column bg-light">
      {/* MENU BUTTON */}
      <button className="menu-toggle-btn btn p-0" onClick={() => setMenuOpen(!menuOpen)}>
        <img
          src={projectLogo}
          alt="MG"
          style={{ width: "50px" }}
        />
      </button>

      {/* MENU PANEL */}
      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <Header />
      <Body />
    </div>
  );
}

export default DashboardPage;