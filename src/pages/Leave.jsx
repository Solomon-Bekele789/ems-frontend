import { useState, useEffect } from 'react'
import api from '../services/api'

function Leave() {
  const [leaves, setLeaves] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    employee_id: '',
    leave_type: 'Annual Leave',
    start_date: '',
    end_date: '',
    reason: '',
  })

  useEffect(() => {
    fetchLeaves()
    fetchEmployees()
  }, [])

  const fetchLeaves = async () => {
    try {
      const response = await api.get('/leave/')
      setLeaves(response.data.leaves || [])
    } catch (err) {
      console.error('Failed to fetch leaves')
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees/')
      setEmployees(response.data.employees || [])
    } catch (err) {
      console.error('Failed to fetch employees')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/leave/', {
        ...form,
        employee_id: parseInt(form.employee_id),
      })
      setMessage('Leave request submitted!')
      setForm({ employee_id: '', leave_type: 'Annual Leave', start_date: '', end_date: '', reason: '' })
      setShowForm(false)
      fetchLeaves()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to submit leave request!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleApprove = async (id) => {
    try {
      await api.put('/leave/' + id + '/approve')
      setMessage('Leave approved!')
      fetchLeaves()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to approve leave!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleReject = async (id) => {
    try {
      await api.put('/leave/' + id + '/reject')
      setMessage('Leave rejected!')
      fetchLeaves()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to reject leave!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const getEmployeeName = (empId) => {
    const emp = employees.find((e) => e.id === empId)
    return emp ? emp.full_name : 'Unknown'
  }

  const getStatusStyle = (status) => {
    if (status === 'approved') return 'bg-green-100 text-green-700'
    if (status === 'rejected') return 'bg-red-100 text-red-700'
    return 'bg-yellow-100 text-yellow-700'
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
            <a href="/departments" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"><span>🏬</span><span>Departments</span></a>
            <a href="/attendance" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"><span>📅</span><span>Attendance</span></a>
            <a href="/leave" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-700 font-medium"><span>🌴</span><span>Leave</span></a>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Leave Management</h2>
              <p className="text-gray-500 text-sm">Manage employee leave requests</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              ➕ Request Leave
            </button>
          </div>

          {message && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              ✅ {message}
            </div>
          )}

          {showForm && (
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">New Leave Request</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                    <select value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500">
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                    <select value={form.leave_type} onChange={(e) => setForm({ ...form, leave_type: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500">
                      <option>Annual Leave</option>
                      <option>Sick Leave</option>
                      <option>Emergency Leave</option>
                      <option>Maternity Leave</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <input type="text" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Brief reason for leave" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">Submit Request</button>
                  <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Leave Requests</h3>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : leaves.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No leave requests yet</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Start</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">End</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{getEmployeeName(leave.employee_id)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{leave.leave_type}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{leave.start_date}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{leave.end_date}</td>
                      <td className="px-6 py-4">
                        <span className={getStatusStyle(leave.status) + ' text-xs px-2 py-1 rounded-full'}>
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {leave.status === 'pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => handleApprove(leave.id)} className="bg-green-100 hover:bg-green-200 text-green-700 text-xs px-3 py-1 rounded transition">
                              Approve
                            </button>
                            <button onClick={() => handleReject(leave.id)} className="bg-red-100 hover:bg-red-200 text-red-700 text-xs px-3 py-1 rounded transition">
                              Reject
                            </button>
                          </div>
                        )}
                        {leave.status !== 'pending' && (
                          <span className="text-xs text-gray-400">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Leave
