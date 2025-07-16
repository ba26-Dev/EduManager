import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        {/* <div className="h-full"> */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/dashboard/*" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
            
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        {/* </div> */}
      </Router>
    </AuthProvider>
  );
};

export default App;