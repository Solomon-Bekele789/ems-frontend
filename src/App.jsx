import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import AddEmployee from './pages/AddEmployee'
import EditEmployee from './pages/EditEmployee'
import EmployeeDetail from './pages/EmployeeDetail'
import Departments from './pages/Departments'
import Attendance from './pages/Attendance'
import Leave from './pages/Leave'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/employees" element={
            <ProtectedRoute><Employees /></ProtectedRoute>
          } />
          <Route path="/employees/add" element={
            <ProtectedRoute><AddEmployee /></ProtectedRoute>
          } />
          <Route path="/employees/edit/:id" element={
            <ProtectedRoute><EditEmployee /></ProtectedRoute>
          } />
          <Route path="/employees/:id" element={
            <ProtectedRoute><EmployeeDetail /></ProtectedRoute>
          } />
          <Route path="/departments" element={
            <ProtectedRoute><Departments /></ProtectedRoute>
          } />
          <Route path="/attendance" element={
            <ProtectedRoute><Attendance /></ProtectedRoute>
          } />
          <Route path="/leave" element={
            <ProtectedRoute><Leave /></ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App