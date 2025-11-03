import { BsBook, BsPencilSquare, BsRecordCircle } from 'react-icons/bs';

import '../cssModules/switcher.css';

function Switcher({ switched, onSwitched, blocked = false, defaultText, text, hasIcon }) {
  return (
    <label className="switcher">
      <input 
        type="checkbox" 
        checked={switched}
        onChange={onSwitched}
        disabled={blocked}
      />
      <span className={`slider ${hasIcon ? "colored" : ""}`}>
        <span className={`slider-text ${hasIcon ? "colored" : ""}`}>{switched ? text : defaultText}</span>
        <span className={`slider-icon ${hasIcon ? "colored" : ""}`}>
          {hasIcon 
            ? <>{switched ? <BsPencilSquare /> : <BsBook />}</>
            : <><BsRecordCircle /></>
          }
        </span>
      </span>
    </label>
  );
}

export default Switcher;