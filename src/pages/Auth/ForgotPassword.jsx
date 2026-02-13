import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call - Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setEmailSent(true);
      toast.success('Password reset link sent to your email');
    } catch (error) {
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-green-600 dark:text-green-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
        </div>

        <Link
          to="/login"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/login"
        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Login
      </Link>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        Forgot Password?
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="label">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
