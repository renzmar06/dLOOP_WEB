'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from "lucide-react";
import { RegisterRequest } from '@/models/User';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { registerUser, clearError } from '@/redux/slices/authSlice';
import toast, { Toaster } from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState<RegisterRequest>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: boolean}>({});
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: {[key: string]: boolean} = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = true;
      toast.error('Please fill up First Name field');
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = true;
      toast.error('Please fill up Last Name field');
    }
    if (!formData.phone.trim()) {
      newErrors.phone = true;
      toast.error('Please fill up Phone Number field');
    }
    if (!formData.address.trim()) {
      newErrors.address = true;
      toast.error('Please fill up Address field');
    }
    if (!formData.email.trim()) {
      newErrors.email = true;
      toast.error('Please fill up Email Address field');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = true;
      toast.error('Please enter a valid email address');
    }
    if (!formData.password.trim()) {
      newErrors.password = true;
      toast.error('Please fill up Password field');
    } else if (formData.password.length < 6) {
      newErrors.password = true;
      toast.error('Password must be at least 6 characters');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    
    if (!validateForm()) return;
    
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Registration successful! Redirecting...');
      router.push('/business-verification');
    } else {
      toast.error(error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-100 to-green-100">
      <div className="container mx-auto overflow-hidden flex flex-col md:flex-row w-full">
        {/* Left side (Form) */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          {/* Logo */}
          <div className="flex items-center mb-6">
            <img src="/images/logo.png" alt="Logo" className="h-16 w-auto mr-2" />
          </div>

          <h2 className="text-3xl font-bold mb-2 text-gray-900">Register Dloop</h2>
          <p className="text-gray-500 mb-8">Create your account to get started</p>

          <form onSubmit={handleSubmit}>
            {/* First Name and Last Name */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block mb-1 ${errors.firstName ? 'text-red-500' : 'text-gray-700'}`}>First Name</label>
                <div className={`flex items-center bg-white border rounded-lg px-3 py-2 ${errors.firstName ? 'border-red-500' : 'border-gray-400'}`}>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full bg-white outline-none text-gray-700"
                    value={formData.firstName}
                    onChange={(e) => {
                      setFormData({...formData, firstName: e.target.value});
                      if (errors.firstName) setErrors({...errors, firstName: false});
                    }}
                  />
                </div>
              </div>
              <div>
                <label className={`block mb-1 ${errors.lastName ? 'text-red-500' : 'text-gray-700'}`}>Last Name</label>
                <div className={`flex items-center bg-white border rounded-lg px-3 py-2 ${errors.lastName ? 'border-red-500' : 'border-gray-400'}`}>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full bg-white outline-none text-gray-700"
                    value={formData.lastName}
                    onChange={(e) => {
                      setFormData({...formData, lastName: e.target.value});
                      if (errors.lastName) setErrors({...errors, lastName: false});
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className={`block mb-1 ${errors.phone ? 'text-red-500' : 'text-gray-700'}`}>Phone Number</label>
              <div className={`flex items-center bg-white border rounded-lg px-3 py-2 ${errors.phone ? 'border-red-500' : 'border-gray-400'}`}>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full bg-white outline-none text-gray-700"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({...formData, phone: e.target.value});
                    if (errors.phone) setErrors({...errors, phone: false});
                  }}
                />
              </div>
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className={`block mb-1 ${errors.address ? 'text-red-500' : 'text-gray-700'}`}>Address</label>
              <div className={`flex items-center bg-white border rounded-lg px-3 py-2 ${errors.address ? 'border-red-500' : 'border-gray-400'}`}>
                <input
                  type="text"
                  placeholder="Enter your address"
                  className="w-full bg-white outline-none text-gray-700"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({...formData, address: e.target.value});
                    if (errors.address) setErrors({...errors, address: false});
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className={`block mb-1 ${errors.email ? 'text-red-500' : 'text-gray-700'}`}>Email Address</label>
              <div className={`flex items-center bg-white border rounded-lg px-3 py-2 ${errors.email ? 'border-red-500' : 'border-gray-400'}`}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white outline-none text-gray-700"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    if (errors.email) setErrors({...errors, email: false});
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className={`block mb-1 ${errors.password ? 'text-red-500' : 'text-gray-700'}`}>Password</label>
              <div className={`flex items-center bg-white border rounded-lg px-3 py-2 ${errors.password ? 'border-red-500' : 'border-gray-400'}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  className="w-full bg-white outline-none text-gray-700"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    if (errors.password) setErrors({...errors, password: false});
                  }}
                />
                <button
                  type="button"
                  className="ml-2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Register button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Links */}
          <div className="flex justify-center text-sm text-gray-600 mt-6">
            <span>Already have an account? </span>
            <a href="/login" className="text-blue-600 hover:underline ml-1">Sign In</a>
          </div>
        </div>

        {/* Right side (Image) */}
        <div className="w-full md:w-1/2 hidden md:block">
          <img
            src="/image/login-page.jpeg"
            alt="Register Visual"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}