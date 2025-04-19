import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Auth
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// User
import UserDashboard from './components/user/Dashboard';
import UserProfile from './components/user/Profile';
import QuizList from './components/user/QuizList';
import TakeQuiz from './components/user/TakeQuiz';
import QuizResults from './components/user/QuizResults';

// Admin
import AdminDashboard from './components/admin/Dashboard';
import ManageUsers from './components/admin/ManageUsers';

// Create placeholder components for missing admin components
const ManageSubjects = () => <div>Subjects Management (Coming Soon)</div>;
const ManageChapters = () => <div>Chapters Management (Coming Soon)</div>;
const ManageQuizzes = () => <div>Quizzes Management (Coming Soon)</div>;
const ManageQuestions = () => <div>Questions Management (Coming Soon)</div>;

// Context
import { AuthProvider } from './context/AuthContext';

// Guards
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User Routes */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <UserDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/quizzes" 
              element={
                <PrivateRoute>
                  <QuizList />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/quiz/:id" 
              element={
                <PrivateRoute>
                  <TakeQuiz />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/results/:id" 
              element={
                <PrivateRoute>
                  <QuizResults />
                </PrivateRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <AdminRoute>
                  <ManageUsers />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/subjects" 
              element={
                <AdminRoute>
                  <ManageSubjects />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/chapters" 
              element={
                <AdminRoute>
                  <ManageChapters />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/quizzes" 
              element={
                <AdminRoute>
                  <ManageQuizzes />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/quizzes/:id/questions" 
              element={
                <AdminRoute>
                  <ManageQuestions />
                </AdminRoute>
              } 
            />
            
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App; 