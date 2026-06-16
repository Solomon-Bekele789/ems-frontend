import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Protects pages that require login
function ProtectedRoute({ children }) {
  const { token } = useAuth()

  // If no token — redirect to login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // If token exists — show the page
  return children
}

export default ProtectedRoute