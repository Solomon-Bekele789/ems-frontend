import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function Dashboard() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats')
        setStats(response.data)
      } catch (err) {
        console.error('Failed to fetch stats')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏢</span>
          <h1 className="text-lg font-bold text-gray-800">Employee Management System</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            👤 {user && user.username}
            <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
              {user && user.role}
            </span>
          </span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex">

        <aside className="w-56 bg-white shadow min-h-screen p-4">
          <div className="space-y-1">
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition">
              <span>📊</span><span>Dashboard</span>
            </a>
            <a href="/employees" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition">
              <span>👥</span><span>Employees</span>
            </a>
            <a href="/departments" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition">
              <span>🏬</span><span>Departments</span>
            </a>
            <a href="/attendance" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition">
              <span>📅</span><span>Attendance</span>
            </a>
            <a href="/leave" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition">
              <span>🌴</span><span>Leave</span>
            </a>
          </div>
        </aside>

        <main className="flex-1 p-6">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-gray-500 text-sm">
              Welcome back, {user && user.username}! Here is what is happening today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

            <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-2xl">👥</div>
              <div>
                <p className="text-sm text-gray-500">Total Employees</p>
                <p className="text-3xl font-bold text-gray-800">{stats ? stats.total_employees : 0}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-2xl">✅</div>
              <div>
                <p className="text-sm text-gray-500">Present Today</p>
                <p className="text-3xl font-bold text-green-600">{stats ? stats.present_today : 0}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full text-2xl">❌</div>
              <div>
                <p className="text-sm text-gray-500">Absent Today</p>
                <p className="text-3xl font-bold text-red-500">{stats ? stats.absent_today : 0}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full text-2xl">🏬</div>
              <div>
                <p className="text-sm text-gray-500">Departments</p>
                <p className="text-3xl font-bold text-gray-800">{stats ? stats.total_departments : 0}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-full text-2xl">🌴</div>
              <div>
                <p className="text-sm text-gray-500">Pending Leaves</p>
                <p className="text-3xl font-bold text-yellow-600">{stats ? stats.pending_leaves : 0}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-full text-2xl">📅</div>
              <div>
                <p className="text-sm text-gray-500">Today</p>
                <p className="text-lg font-bold text-gray-800">{stats ? stats.date : ''}</p>
              </div>
            </div>

          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="flex gap-3 flex-wrap">
              <a href="/employees/add" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition">
                ➕ Add Employee
              </a>
              <a href="/employees" className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg transition">
                👥 View Employees
              </a>
              <a href="/attendance" className="bg-green-100 hover:bg-green-200 text-green-700 text-sm px-4 py-2 rounded-lg transition">
                📅 Mark Attendance
              </a>
              <a href="/leave" className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 text-sm px-4 py-2 rounded-lg transition">
                🌴 Manage Leave
              </a>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}

export default Dashboard
