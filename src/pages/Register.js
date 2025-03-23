import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Registration, 2 = OTP Verification
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    password: '',
    confirmPassword: '',
    accountType: 'client',
    otp: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSentTime, setOtpSentTime] = useState(null); // Track when OTP was sent
  const [cooldown, setCooldown] = useState(0); // Cooldown timer in seconds

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send registration data to the backend
      const { firstName, lastName, email, phoneNo, accountType, password, confirmPassword } = formData;

      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/send-otp`, {
        firstName,
        lastName,
        email,
        phoneNo,
        accountType,
        password,
        confirmPassword,
      });

      if (response.data.success) {
        toast.success("OTP sent Successfully");
        setOtpSentTime(Date.now()); // Record the time OTP was sent
        setStep(2); // Move to OTP verification step
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    setLoading(true);
    setError('');
  
    try {
      const { firstName, lastName, email, phoneNo, accountType, password, confirmPassword, otp } = formData;
  
      
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
        firstName,
        lastName,
        email,
        phoneNo,
        accountType,
        password,
        confirmPassword,
        otp,
      });
  
      
      if (response.data.success) {
        toast.success('Registration successful!');
        navigate('/login');
        
        // Redirect to login or dashboard
      }
    } catch (err) {
      console.error('Verification Error:', err);
      setError(err.response?.data?.message || 'OTP verification failed');
      toast.error(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const { firstName, lastName, email, phoneNo, accountType, password, confirmPassword } = formData;
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/send-otp`, {
        firstName,
        lastName,
        email,
        phoneNo,
        accountType,
        password,
        confirmPassword,
      });
      if (response.data.success) {
        setOtpSentTime(Date.now()); // Reset the OTP sent time
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
      toast.error(err.response?.data?.message || 'Failed to resend OTP');

    } finally {
      setLoading(false);
    }
  };

  // Cooldown timer logic
  useEffect(() => {
    if (otpSentTime) {
      const interval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - otpSentTime) / 1000); // Time elapsed in seconds
        const remainingCooldown = Math.max(300 - elapsedTime, 0); // 5 minutes = 300 seconds
        setCooldown(remainingCooldown);

        if (remainingCooldown === 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [otpSentTime]);

  // Function to go back to step 1
  const handleBackToRegistration = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {step === 1 ? 'Register' : 'Verify OTP'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {step === 1 ? (
          // Registration Form
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 "
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 "
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 "
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 "
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Account Type</label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 "
                required
              >
                <option value="client">Client</option>
                <option value="worker">Worker</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 "
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 "
                required
              />
            </div>
            <button
              type="submit"
              className="w-full  bg-gray-800 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Register'}
            </button>
          </form>
        ) : (
          // OTP Verification
          <>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Enter OTP</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 "
                required
              />
            </div>
            <button
              onClick={handleVerifyOTP}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg mb-4"
              disabled={loading}
            >
              {loading ? 'Verifying OTP...' : 'Verify OTP'}
            </button>
            <button
              onClick={handleResendOTP}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2 px-4 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg mb-4"
              disabled={cooldown > 0 || loading}
            >
              {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
            </button>
            {/* Back Button */}
            <button
              onClick={handleBackToRegistration}
              className="w-full bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 py-2 px-4 rounded-lg hover:from-gray-400 hover:to-gray-500 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Back to Registration
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;