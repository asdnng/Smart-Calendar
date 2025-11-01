import { useEffect, useState } from 'react';

import gilWelcome from '../assets/gil-sit-welcome.png';
import gilWelcomeGuide from '../assets/gil-sit-welcome-guide.png';

function DashboardHome() {
  const [gilImage, setGilImage] = useState(gilWelcome);

  useEffect(() => {
    setTimeout(() => setGilImage(gilWelcomeGuide), 3500);
  }, [])

  return (
    <div className="row flex-grow-1">
      <div className="col-12 bg-light text-dark d-flex justify-content-center align-items-center p-3">
        <img
          src={gilImage}
          alt="gil"
          className="gil-welcome"
        />
      </div>
    </div>
  );
}

export default DashboardHome;
