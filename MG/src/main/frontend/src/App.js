// Import Order: React -> third-parties -> files/components -> assets -> css

import { useState } from 'react';
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './components/login/login.js';
import CookiePage from './components/login/CookiePage.js';
import DashboardPage from './components/dashboard.js';
import DashboardHome from './components/home.js';
import Chat from './components/chat.js';
import TaskList from './components/views/tasklist.js';
import DayView from './components/views/day.js';
import WeekView from './components/views/week.js';
import MonthView from './components/views/month.js';

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setAuth={setIsAuthenticated} />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="chat" element={<Chat />}/>
          <Route path="view">
            <Route path="list" element={<TaskList />}/>
            <Route path="day" element={<DayView />}/>
            <Route path="week" element={<WeekView />}/>
            <Route path="month" element={<MonthView />}/>
          </Route>
          <Route path="sync" />
          <Route path="account" />
          <Route path="setting" />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
