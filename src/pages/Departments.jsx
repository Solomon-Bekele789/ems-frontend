import { useState, useEffect } from 'react'
import api from '../services/api'

function Departments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({ name: '', description: '' })

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments/')
      setDepartments(response.data || [])
    } catch (err) {
      console.error('Failed to fetch departments')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/departments/', form)
      setMessage('Department created successfully!')
      setForm({ name: '', description: '' })
      setShowForm(false)
      fetchDepartments()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to create department!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm('Delete department ' + name + '?')) return
    try {
      await api.delete('/departments/' + id)
      setMessage('Department deleted!')
      fetchDepartments()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to delete department!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏢</span>
          <h1 className="text-lg font-bold text-gray-800">Employee Management System</h1>
        </div>
        <a href="/dashboard" className="text-blue-600 text-sm hover:underline">← Dashboard</a>
      </nav>

      <div className="flex">
        <aside className="w-56 bg-white shadow min-h-screen p-4">
          <div className="space-y-1">
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"><span>📊</span><span>Dashboard</span></a>
            <a href="/employees" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"><span>👥</span><span>Employees</span></a>
            <a href="/departments" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-700 font-medium"><span>🏬</span><span>Departments</span></a>
            <a href="/attendance" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"><span>📅</span><span>Attendance</span></a>
            <a href="/leave" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"><span>🌴</span><span>Leave</span></a>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Departments</h2>
              <p className="text-gray-500 text-sm">Manage company departments</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              ➕ Add Department
            </button>
          </div>

          {message && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              ✅ {message}
            </div>
          )}

          {showForm && (
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">New Department</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Engineering"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief description"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
                    Create Department
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-gray-500">Loading departments...</p>
            ) : departments.length === 0 ? (
              <p className="text-gray-500">No departments yet. Create one!</p>
            ) : (
              departments.map((dept) => (
                <div key={dept.id} className="bg-white rounded-xl shadow p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold">
                      {dept.name.charAt(0)}
                    </div>
                    <button
                      onClick={() => handleDelete(dept.id, dept.name)}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{dept.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{dept.description || 'No description'}</p>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Departments
