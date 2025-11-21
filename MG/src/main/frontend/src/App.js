// Import Order: React -> third-parties -> files/components -> assets -> css

import { useState } from 'react';
import { Navigate, useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './components/login/login.js';
import CookiePage from './components/login/cookie.js';
import DashboardPage from './components/dashboard.js';
import DashboardHome from './components/home.js';
import Chat from './components/chat.js';
import TaskList from './components/views/tasklist.js';
import DayView from './components/views/day.js';
import WeekView from './components/views/week.js';
import MonthView from './components/views/month.js';
import Setting from './components/settings/setting.js';
import Account from './components/settings/account.js';
import TaskCategories from './components/settings/categories.js';

import './App.css';

function NavigateBackWrapper({ Component, ...props }) {
  const navigate = useNavigate();

  return (
    <Component 
      onBack={() => navigate(-1)}
      {...props}
    />
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);  // type false to test prevention of manual navigation

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    <Navigate path="/" />
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setAuth={setIsAuthenticated} />} />
        <Route path="/cookie" element={<CookiePage />} />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <DashboardPage onLogout={handleLogout} /> : <Navigate to="/" replace />
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="chat" element={<Chat />} />
          <Route path="view">
            <Route path="list" element={<TaskList />} />
            <Route path="day" element={<DayView />} />
            <Route path="week" element={<WeekView />} />
            <Route path="month" element={<MonthView />} />
          </Route>

          <Route path="setting" element={<Setting />} >
            <Route 
              path="account" 
              element={
                <NavigateBackWrapper
                  Component={Account}
                  onLogout={handleLogout}
                />
              } 
            />
            <Route 
              path="taskCategories"
              element={
                <NavigateBackWrapper
                  Component={TaskCategories}
                />
              }  
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
