import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function DoctorDashboard() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function checkDoctor() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== 'doctor@patna.com') {
        navigate('/dashboard')
      }
    }
    
    async function fetchAllBookings() {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')

      if (error) console.error(error)
      setBookings(data || [])
      setLoading(false)
    }

    checkDoctor()
    fetchAllBookings()
  }, [navigate])

  async function updateStatus(id: string, status: string) {
    await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
    setBookings(bookings.map(b => 
      b.id === id ? {...b, status} : b
    ))
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">All Bookings</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Patient</th>
              <th className="py-2 px-4 border">Test</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{booking.name}</td>
                <td className="py-2 px-4 border">{booking.test_type}</td>
                <td className="py-2 px-4 border">
                  {new Date(booking.preferred_date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border">{booking.status || 'Pending'}</td>
                <td className="py-2 px-4 border space-x-2">
                  <button
                    onClick={() => updateStatus(booking.id, 'Completed')}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Complete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}