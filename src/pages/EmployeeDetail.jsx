import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

function EmployeeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, attRes, leaveRes] = await Promise.all([
          api.get('/employees/' + id),
          api.get('/attendance/employee/' + id),
          api.get('/leave/employee/' + id),
        ])
        setEmployee(empRes.data)
        setAttendance(attRes.data.attendance || [])
        setLeaves(leaveRes.data.leaves || [])
      } catch (err) {
        console.error('Failed to load employee')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading employee profile...</p>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Employee not found!</p>
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

          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-3xl">
                {employee.full_name.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800">{employee.full_name}</h2>
                <p className="text-gray-500">{employee.position}</p>
                <span className={employee.is_active ? 'bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full' : 'bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full'}>
                  {employee.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <button
                onClick={() => navigate('/employees/edit/' + id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                ✏️ Edit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Employee Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Employee ID</span>
                  <span className="text-sm font-medium">{employee.employee_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm font-medium">{employee.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Phone</span>
                  <span className="text-sm font-medium">{employee.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Salary</span>
                  <span className="text-sm font-medium text-green-600">${employee.salary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Hire Date</span>
                  <span className="text-sm font-medium">{employee.hire_date}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Leave History</h3>
              {leaves.length === 0 ? (
                <p className="text-gray-500 text-sm">No leave requests yet</p>
              ) : (
                <div className="space-y-2">
                  {leaves.slice(0, 5).map((leave) => (
                    <div key={leave.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium">{leave.leave_type}</p>
                        <p className="text-xs text-gray-500">{leave.start_date} to {leave.end_date}</p>
                      </div>
                      <span className={
                        leave.status === 'approved' ? 'bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full' :
                        leave.status === 'rejected' ? 'bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full' :
                        'bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full'
                      }>
                        {leave.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Attendance</h3>
            {attendance.length === 0 ? (
              <p className="text-gray-500 text-sm">No attendance records yet</p>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Check In</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Check Out</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendance.slice(0, 10).map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm">{record.date}</td>
                      <td className="px-4 py-2 text-sm text-green-600">{record.check_in || '-'}</td>
                      <td className="px-4 py-2 text-sm text-red-500">{record.check_out || '-'}</td>
                      <td className="px-4 py-2 text-sm">{record.working_hours ? record.working_hours + 'h' : '-'}</td>
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

export default EmployeeDetail
