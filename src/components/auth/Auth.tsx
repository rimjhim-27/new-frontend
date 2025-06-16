import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { AuthError } from '@supabase/supabase-js';
import { Button, TextInput, Card, Title, Text } from '@mantine/core'; // Using Mantine UI (adapt to your UI lib)

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirect to dashboard or previous page
      navigate('/dashboard');
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      alert('Check your email for the confirmation link!');
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card withBorder shadow="md" className="w-full max-w-md p-8">
        <Title order={2} className="text-center mb-6">
          Medical Portal Login
        </Title>

        {error && (
          <Text color="red" className="mb-4 text-center">
            {error}
          </Text>
        )}

        <form onSubmit={handleLogin}>
          <TextInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            className="mb-4"
          />

          <TextInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="mb-6"
          />

          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={!email || !password}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Text size="sm">
            Don't have an account?{' '}
            <Button
              variant="subtle"
              size="sm"
              onClick={handleSignUp}
              disabled={loading}
            >
              Sign Up
            </Button>
          </Text>
        </div>

        <div className="mt-4 text-center">
          <Button
            variant="subtle"
            size="sm"
            onClick={() => navigate('/reset-password')}
          >
            Forgot password?
          </Button>
        </div>
      </Card>
    </div>
  );
};