import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

function EditEmployee() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    position: '',
    salary: '',
    hire_date: '',
    department_id: '',
    is_active: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, deptRes] = await Promise.all([
          api.get('/employees/' + id),
          api.get('/departments/')
        ])
        const emp = empRes.data
        setForm({
          full_name: emp.full_name || '',
          email: emp.email || '',
          phone: emp.phone || '',
          position: emp.position || '',
          salary: emp.salary || '',
          hire_date: emp.hire_date || '',
          department_id: emp.department_id || '',
          is_active: emp.is_active,
        })
        setDepartments(deptRes.data || [])
      } catch (err) {
        setError('Failed to load employee data')
      } finally {
        setFetching(false)
      }
    }
    fetchData()
  }, [id])

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.put('/employees/' + id, {
        ...form,
        salary: parseFloat(form.salary),
        department_id: parseInt(form.department_id),
      })
      navigate('/employees')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update employee!')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading employee data...</p>
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
        <a href="/employees" className="text-blue-600 text-sm hover:underline">← Back to Employees</a>
      </nav>

      <div className="flex">
        <aside className="w-56 bg-white shadow min-h-screen p-4">
          <div className="space-y-1">
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"><span>📊</span><span>Dashboard</span></a>
            <a href="/employees" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-700 font-medium"><span>👥</span><span>Employees</span></a>
            <a href="/departments" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"><span>🏬</span><span>Departments</span></a>
            <a href="/attendance" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"><span>📅</span><span>Attendance</span></a>
            <a href="/leave" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"><span>🌴</span><span>Leave</span></a>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Employee</h2>
            <p className="text-gray-500 text-sm">Update employee information</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 max-w-2xl">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input type="text" name="position" value={form.position} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                  <input type="number" name="salary" value={form.salary} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                  <input type="date" name="hire_date" value={form.hire_date} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select name="department_id" value={form.department_id} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500">
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4" />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active Employee</label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
                  {loading ? 'Saving...' : '💾 Save Changes'}
                </button>
                <a href="/employees" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium transition">
                  Cancel
                </a>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

export default EditEmployee
