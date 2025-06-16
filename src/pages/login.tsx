import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AuthError } from '@supabase/supabase-js';
import { 
  Container,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Alert,
  Stack,
  Anchor
} from '@mantine/core';
import { IconAlertCircle, IconLock, IconMail } from '@tabler/icons-react';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) throw error;

      navigate('/dashboard'); // Redirect after successful login
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
      setMessage('Check your email for the confirmation link!');
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!credentials.email) {
      setError('Please enter your email first');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(credentials.email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
      setMessage('Password reset link sent to your email!');
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" py="xl">
      <Stack>
        <Title order={1} ta="center">
          Welcome Back
        </Title>
        
        {error && (
          <Alert 
            icon={<IconAlertCircle size="1rem" />} 
            title="Error" 
            color="red"
            variant="filled"
          >
            {error}
          </Alert>
        )}

        {message && (
          <Alert 
            title="Success" 
            color="green"
          >
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              name="email"
              label="Email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              icon={<IconMail size="1rem" />}
            />

            <PasswordInput
              name="password"
              label="Password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Your password"
              required
              icon={<IconLock size="1rem" />}
            />

            <Button 
              type="submit" 
              loading={loading}
              disabled={!credentials.email || !credentials.password}
              fullWidth
            >
              Sign In
            </Button>

            <Text size="sm" ta="center">
              Don't have an account?{' '}
              <Anchor 
                component="button" 
                type="button" 
                onClick={handleSignUp}
                disabled={loading}
              >
                Sign Up
              </Anchor>
            </Text>

            <Text size="sm" ta="center">
              <Anchor 
                component="button" 
                type="button" 
                onClick={handlePasswordReset}
                disabled={loading}
              >
                Forgot password?
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}