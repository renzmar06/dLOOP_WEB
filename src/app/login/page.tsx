'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff,Leaf } from "lucide-react";
import { LoginRequest } from '@/models/User';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { loginUser, clearError } from '@/redux/slices/authSlice';

export default function Login() {
  const [formData, setFormData] = useState<LoginRequest>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    setSuccess('');
    
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => router.push('/'), 1500);
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-100 to-green-100">
      <div className="container mx-auto overflow-hidden flex flex-col md:flex-row w-full">
        {/* Left side (Form) */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          {/* Logo */}
          <div className="flex items-center space-x-2">
          <div className="w-10 h-9 bg-gradient-to-br from-teal-500 to-green-500 rounded-lg flex items-center justify-center">
            <Leaf className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">dLoop</h1>
            <p className="text-xs text-gray-500"> Partner Business</p>
          </div>
        </div>

          <h2 className="text-3xl font-bold mb-2 text-gray-900">Welcome to dloop</h2>
          <p className="text-gray-500 mb-8">Please login to your account</p>

          <form onSubmit={handleSubmit}>
            {/* Email input */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Email</label>
              <div className="flex items-center bg-white border border-gray-400 rounded-lg px-3 py-2">
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="w-full bg-white outline-none text-gray-700"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Password input */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Password</label>
              <div className="flex items-center bg-white border border-gray-400 rounded-lg px-3 py-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="w-full bg-white outline-none text-gray-700"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  className="ml-2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                  suppressHydrationWarning
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-orange-500" disabled />
                <span className="text-gray-600 text-sm">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 text-sm hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Success message */}
            {success && (
              <div className="mb-4 text-green-700 ">
                {success}
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition cursor-pointer"
              suppressHydrationWarning
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Links */}
          <div className="flex justify-center text-sm text-gray-600 mt-6">
            <span>Don't have an account? </span>
            <a href="/register" className="text-blue-600 hover:underline ml-1">Sign Up</a>
          </div>
        </div>

        {/* Right side (Image) */}
        <div className="w-full md:w-1/2 hidden md:block">
          <img
            src="/image/Dloop-business.jpeg"
            alt="Login Visual"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}