import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Employees() {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchEmployees()
    fetchDepartments()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees/')
      setEmployees(response.data.employees || [])
    } catch (err) {
      console.error('Failed to fetch employees')
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments/')
      setDepartments(response.data || [])
    } catch (err) {
      console.error('Failed to fetch departments')
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm('Are you sure you want to delete ' + name + '?')) return
    try {
      await api.delete('/employees/' + id)
      setMessage('Employee deleted successfully!')
      fetchEmployees()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to delete employee!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      let url = '/employees/?'
      if (search) url += 'search=' + search + '&'
      if (selectedDept) url += 'department_id=' + selectedDept
      const response = await api.get(url)
      setEmployees(response.data.employees || [])
    } catch (err) {
      console.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSearch('')
    setSelectedDept('')
    fetchEmployees()
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏢</span>
          <h1 className="text-lg font-bold text-gray-800">Employee Management System</h1>
        </div>
        <a href="/dashboard" className="text-blue-600 text-sm hover:underline">← Back to Dashboard</a>
      </nav>

      <div className="flex">

        <aside className="w-56 bg-white shadow min-h-screen p-4">
          <div className="space-y-1">
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition">
              <span>📊</span><span>Dashboard</span>
            </a>
            <a href="/employees" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-700 font-medium">
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

          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Employees</h2>
              <p className="text-gray-500 text-sm">Manage all company employees</p>
            </div>
            <a
              href="/employees/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              ➕ Add Employee
            </a>
          </div>

          {message && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              ✅ {message}
            </div>
          )}

          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <div className="flex gap-3 flex-wrap">
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 flex-1 min-w-48"
              />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                🔍 Search
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading employees...</div>
            ) : employees.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-4xl mb-2">👥</p>
                <p>No employees found</p>
                <a href="/employees/add" className="text-blue-600 text-sm hover:underline">Add your first employee</a>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">ID</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Position</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Salary</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-500">{emp.employee_id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                            {emp.full_name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-800">{emp.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{emp.position}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{emp.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">${emp.salary.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={emp.is_active ? 'bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full' : 'bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full'}>
                          {emp.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate('/employees/' + emp.id)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() => navigate('/employees/edit/' + emp.id)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs px-3 py-1 rounded transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(emp.id, emp.full_name)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 text-xs px-3 py-1 rounded transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Showing {employees.length} employee{employees.length !== 1 ? 's' : ''}
          </div>

        </main>
      </div>
    </div>
  )
}

export default Employees
