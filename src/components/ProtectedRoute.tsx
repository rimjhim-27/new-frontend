import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function ProtectedRoute({ children, doctorOnly = false }: { 
  children: React.ReactNode
  doctorOnly?: boolean 
}) {
  const navigate = useNavigate()

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        navigate('/auth')
      } else if (doctorOnly && user.email !== 'doctor@patna.com') {
        navigate('/dashboard')
      }
    }

    checkAuth()
  }, [navigate, doctorOnly])

  return <>{children}</>
}