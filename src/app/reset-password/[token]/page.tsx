"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { validateResetToken, resetPassword, clearError, clearResetMessage } from "../../../redux/slices/authSlice";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";

export default function ResetPassword() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const { loading, error, resetMessage } = useAppSelector((state) => state.auth);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [validating, setValidating] = useState(true);

  const token = Array.isArray(params?.token) ? params.token[0] : params?.token;

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        setValidating(false);
        return;
      }

      try {
        const result = await dispatch(validateResetToken(token));
        if (validateResetToken.fulfilled.match(result)) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
        }
      } catch (error) {
        setTokenValid(false);
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) return;

    if (password !== confirmPassword) {
      return;
    }

    dispatch(clearError());
    dispatch(clearResetMessage());
    
    const result = await dispatch(resetPassword({ token: token!, password, confirmPassword }));
    
    if (resetPassword.fulfilled.match(result)) {
      // Redirect to login after successful reset
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  const handleBackToForgotPassword = () => {
    dispatch(clearError());
    dispatch(clearResetMessage());
    router.push("/forgot-password");
  };

  // Show loading while validating token
  if (validating) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-100 to-green-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating reset token...</p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (!tokenValid) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-100 to-green-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid or Expired Link</h2>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <button
              onClick={handleBackToForgotPassword}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-100 to-green-100">
      <div className="container mx-auto overflow-hidden flex flex-col md:flex-row w-full">
        {/* Left side (Form) */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          {/* Logo */}
          <div className="flex items-center mb-6">
            <img src="/images/logo.png" alt="Logo" className="h-16 w-auto mr-2" />
          </div>

          <h2 className="text-3xl font-bold mb-2 text-gray-900">Reset Your Password</h2>
          <p className="text-gray-500 mb-8">
            Enter your new password below to reset your account password.
          </p>

          <form onSubmit={handleSubmit}>
            {/* New Password input */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">New Password</label>
              <div className="flex items-center bg-white border border-gray-400 rounded-lg px-3 py-2">
                <Lock size={20} className="text-gray-400 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full bg-white outline-none text-gray-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password input */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-1">Confirm New Password</label>
              <div className="flex items-center bg-white border border-gray-400 rounded-lg px-3 py-2">
                <Lock size={20} className="text-gray-400 mr-3" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="w-full bg-white outline-none text-gray-700"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Reset Password button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition mb-4"
              disabled={loading || !password || !confirmPassword || password !== confirmPassword}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          {/* Success Message */}
          {resetMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{resetMessage}</p>
              <p className="text-green-600 text-xs mt-1">Redirecting to login page...</p>
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
            onClick={() => router.push("/login")}
            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>
        </div>

        {/* Right side (Image) */}
        <div className="w-full md:w-1/2 hidden md:block">
          <img
            src="/image/login-page.jpeg"
            alt="Reset Password Visual"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}