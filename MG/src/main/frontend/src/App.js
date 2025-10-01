// Import Order: React -> third-parties -> files/components -> assets -> css

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './components/login/login.js';
import DashboardPage from './components/dashboard.js';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
