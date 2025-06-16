import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchBookings() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return navigate('/auth')
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)

      if (error) console.error(error)
      setBookings(data || [])
      setLoading(false)
    }

    fetchBookings()
  }, [navigate])

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Bookings</h1>
      
      {bookings.length === 0 ? (
        <p>No bookings yet. <button 
          onClick={() => navigate('/booking')}
          className="text-blue-500 hover:underline"
        >
          Book a test now
        </button></p>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="p-4 border rounded-lg">
              <h3 className="font-medium">{booking.test_type}</h3>
              <p>Date: {new Date(booking.preferred_date).toLocaleDateString()}</p>
              <p>Status: {booking.status || 'Pending'}</p>
              {booking.report_url && (
                <button 
                  onClick={() => window.open(
                    supabase.storage.from('reports').getPublicUrl(booking.report_url).data.publicUrl
                  )}
                  className="mt-2 text-sm bg-green-500 text-white px-3 py-1 rounded"
                >
                  Download Report
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}