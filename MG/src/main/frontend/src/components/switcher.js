import { BsBook, BsPencilSquare } from 'react-icons/bs';

import '../cssModules/switcher.css';

function Switcher({ switched, onSwitched, blocked = false }) {
  return (
    <label className="switcher">
      <input 
        type="checkbox" 
        checked={switched}
        onChange={onSwitched}
        disabled={blocked}
      />
      <span className="slider">
        <span className="slider-text">{switched ? "Edit" : "Read"}</span>
        <span className="slider-icon">
          {switched ? <BsPencilSquare /> : <BsBook />}
        </span>
      </span>
    </label>
  );
}

export default Switcher;