// ============================================
// Login Page
// ============================================

import React, { useState } from 'react';
import { Radio, Lock, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import type { LoginCredentials } from '../../types';
// import { useAuth } from '@/hooks/useAuth';
// import Input from '@/components/common/Input';
// import Button from '@/components/common/Button';
// import { LoginCredentials } from '@/types';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setIsLoading(true);
      await login(credentials);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-white p-4 rounded-full shadow-lg mb-4">
            <Radio className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Emirate FM 98.5</h1>
          <p className="text-blue-100">Radio Station Invoicing System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Username"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={credentials.username}
              onChange={handleChange}
              icon={<User className="h-5 w-5" />}
              required
              autoFocus
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              icon={<Lock className="h-5 w-5" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact your system administrator
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8">
          <p className="text-blue-100 text-sm">
            © 2026 Emirate FM Radio Station. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;