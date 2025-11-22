import { useEffect, useRef } from 'react';

import { BsFunnelFill } from 'react-icons/bs';

import { Categories } from '../../Categories.js';

function Filter({ dropdown, OnDropdown, category, categoryChange }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (dropdown && dropdownRef.current && !dropdownRef.current.contains(e.target)) OnDropdown();
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [dropdown, OnDropdown]);

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button 
        className={`filter-tasks btn d-flex ms-1 ${category.length === 0 ? "bg-white text-black" : "bg-black text-white"} rounded-3 fs-5`}
        onClick={OnDropdown}
      >
        <BsFunnelFill />
      </button>

      {dropdown && (
        <div
          className="dropdown-menu show mt-2 p-2 bg-white rounded-3 text-dark"
          style={{ zIndex: 1000 }}
        >
          {Categories.map((c) => (
            <label key={c.value} className="d-flex mb-1 ps-2 cursor-pointer">
              <input
                type="checkbox"
                className="me-2 cursor-pointer"
                checked={category.includes(c.value)}
                onChange={(e) => {
                  if (e.target.checked) categoryChange([...category, c.value]);
                  else categoryChange(category.filter((v) => v !== c.value));
                }}
              />
              <span>{c.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default Filter;