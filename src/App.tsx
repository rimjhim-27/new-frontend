import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Tests from "./pages/Tests";
import Packages from "./pages/Packages";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { supabase } from "./lib/supabase";
import { useEffect, useState } from "react";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import LoadingSpinner from "./components/LoadingSpinner";

// 1. Move doctor email to environment variable
const DOCTOR_EMAIL = import.meta.env.VITE_DOCTOR_EMAIL || 'rimjhim58096@gmail.com';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDoctor, setIsDoctor] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      
      setUser(currentUser ?? null);
      setIsDoctor(currentUser?.email === DOCTOR_EMAIL);
      setLoading(false);

      // 2. Setup login auditing
      if (currentUser?.email === DOCTOR_EMAIL) {
        await supabase
          .from('audit_logs')
          .insert({
            event: 'doctor_login_attempt',
            user_id: currentUser.id,
            metadata: { ip: window.location.hostname }
          });
      }
    };

    checkAuth();

    // 3. Enhanced auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        setUser(currentUser ?? null);
        setIsDoctor(currentUser?.email === DOCTOR_EMAIL);
        
        if (event === 'SIGNED_IN' && currentUser?.email === DOCTOR_EMAIL) {
          // Implement 2FA check here
          console.log('Doctor logged in - 2FA check needed');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar user={user} isDoctor={isDoctor} />
            <main className="flex-1 container mx-auto px-4 py-8">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/tests" element={<Tests />} />
                <Route path="/packages" element={<Packages />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Auth routes */}
                <Route 
                  path="/auth" 
                  element={!user ? <Auth /> : <Navigate to={isDoctor ? "/doctor" : "/dashboard"} />} 
                />
                
                {/* Protected routes */}
                <Route 
                  path="/booking" 
                  element={user ? <Booking /> : <Navigate to="/auth" replace />} 
                />
                
                <Route 
                  path="/dashboard" 
                  element={
                    user ? (
                      isDoctor ? (
                        <Navigate to="/doctor" replace />
                      ) : (
                        <Dashboard />
                      )
                    ) : (
                      <Navigate to={`/auth?redirect=/dashboard`} replace />
                    )
                  } 
                />
                
                <Route 
                  path="/doctor" 
                  element={
                    isDoctor ? (
                      <DoctorDashboard />
                    ) : (
                      <Navigate to={user ? "/dashboard" : "/auth"} replace />
                    )
                  } 
                />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;