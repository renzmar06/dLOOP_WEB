"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { forgotPassword, clearError, clearResetMessage } from "../../redux/slices/authSlice";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPassword() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, resetMessage } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    dispatch(clearError());
    dispatch(clearResetMessage());
    
    await dispatch(forgotPassword(email));
  };

  const handleBackToLogin = () => {
    dispatch(clearError());
    dispatch(clearResetMessage());
    router.push("/login");
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

          <h2 className="text-3xl font-bold mb-2 text-gray-900">Forgot Password?</h2>
          <p className="text-gray-500 mb-8">
            Enter your email address and we`ll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email input */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-1">Email Address</label>
              <div className="flex items-center bg-white border border-gray-400 rounded-lg px-3 py-2">
                <Mail size={20} className="text-gray-400 mr-3" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-white outline-none text-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Send Reset Link button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition mb-4"
              disabled={loading || !email}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Success Message */}
          {resetMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{resetMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Back to Login */}
          <button
            onClick={handleBackToLogin}
            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>

          {/* Links */}
          <div className="flex justify-between text-sm text-gray-600 mt-6">
            {/* <a href="#" className="hover:underline">Back Home</a> */}
            <a href="/register" className="hover:underline">Create an Account</a>
          </div>
        </div>

        {/* Right side (Image) */}
        <div className="w-full md:w-1/2 hidden md:block">
          <img
            src="/image/login-page.jpeg"
            alt="Forgot Password Visual"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}