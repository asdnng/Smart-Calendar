import { BsFillHeartFill } from 'react-icons/bs';

import "../cssModules/loading.css";

function Loading() {
  return (
    <div className="loading-overlay">
      <div className="loading-content row">
        <h3 className="loading-text fw-bold">
          LOADING
          <span className="loading-dots">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </span>
        </h3>
        <h4 className="fw-semibold">
          Please wait a moment 
          <BsFillHeartFill className="loading-heart ms-3" />
        </h4>
      </div>
    </div>
  );
}

export default Loading;