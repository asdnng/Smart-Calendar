// Import Order: React -> third-parties -> files/components -> assets -> css

import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './components/login/login.js';
import DashboardPage from './components/dashboard.js';

import './App.css';

function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("token");
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
