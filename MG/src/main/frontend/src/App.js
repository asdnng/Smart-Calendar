import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';

import LoginPage from './components/login.js';
import DashboardPage from './components/dashboard.js';

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
