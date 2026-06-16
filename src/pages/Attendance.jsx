import { useState, useEffect } from 'react'
import api from '../services/api'

function Attendance() {
  const [records, setRecords] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    check_in: '',
  })

  useEffect(() => {
    fetchRecords()
    fetchEmployees()
  }, [])

  const fetchRecords = async () => {
    try {
      const response = await api.get('/attendance/')
      setRecords(response.data.attendance || [])
    } catch (err) {
      console.error('Failed to fetch attendance')
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

  const handleCheckIn = async (e) => {
    e.preventDefault()
    try {
      await api.post('/attendance/checkin', {
        employee_id: parseInt(form.employee_id),
        date: form.date,
        check_in: form.check_in,
      })
      setMessage('Check in recorded successfully!')
      setForm({ ...form, employee_id: '', check_in: '' })
      fetchRecords()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Failed to record check in!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const getEmployeeName = (empId) => {
    const emp = employees.find((e) => e.id === empId)
    return emp ? emp.full_name : 'Unknown'
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
            <a href="/attendance" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-700 font-medium"><span>📅</span><span>Attendance</span></a>
            <a href="/leave" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"><span>🌴</span><span>Leave</span></a>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Attendance</h2>
            <p className="text-gray-500 text-sm">Track employee attendance</p>
          </div>

          {message && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              ✅ {message}
            </div>
          )}

          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Mark Attendance</h3>
            <form onSubmit={handleCheckIn} className="flex gap-3 flex-wrap">
              <select
                value={form.employee_id}
                onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                required
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                ))}
              </select>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <input
                type="time"
                value={form.check_in}
                onChange={(e) => setForm({ ...form, check_in: e.target.value })}
                required
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition">
                ✅ Mark Check In
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Attendance Records</h3>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading records...</div>
            ) : records.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No attendance records yet</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Check In</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Check Out</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{getEmployeeName(record.employee_id)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.date}</td>
                      <td className="px-6 py-4 text-sm text-green-600">{record.check_in || '-'}</td>
                      <td className="px-6 py-4 text-sm text-red-500">{record.check_out || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.working_hours ? record.working_hours + 'h' : '-'}</td>
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

export default Attendance
