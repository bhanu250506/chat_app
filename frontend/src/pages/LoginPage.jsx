import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/image.png'; // Replace with your logo
import { Eye, EyeOff } from 'lucide-react'; // Install Lucide icons or use any icon library

const LoginPage = () => {
  const [currState, setCurrState] = useState('Sign Up');
  const [isStepTwo, setIsStepTwo] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currState === 'Sign Up' && !isStepTwo) {
      setIsStepTwo(true);
      return;
    }

    try {
      await login(currState === 'Sign Up' ? 'signup' : 'login', {
        fullName,
        email,
        password,
        bio,
      });
      navigate('/');
    } catch (err) {
      console.error('Login/Signup failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center px-4">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl w-[min(90vw,400px)] text-white relative shadow-2xl">
        {/* Logo */}
        <img src={logo} alt="logo" className="w-12 mb-6 mx-auto" />

        {/* Tab Switcher */}
        <div className="flex justify-between mb-6 text-sm font-medium">
          {['Login', 'Sign Up'].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 rounded-md transition-all duration-300 ${
                currState === tab
                  ? 'bg-white/20 text-white'
                  : 'bg-transparent text-gray-300 hover:text-white'
              }`}
              onClick={() => {
                setCurrState(tab);
                setIsStepTwo(false);
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
          {currState === 'Sign Up' && !isStepTwo && (
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              placeholder="Enter your full name"
              className="p-3 rounded-md bg-white/10 border border-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              required
            />
          )}

          {!isStepTwo && (
            <>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email address"
                className="p-3 rounded-md bg-white/10 border border-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                required
              />
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  className="p-3 w-full pr-10 rounded-md bg-white/10 border border-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </>
          )}

          {currState === 'Sign Up' && isStepTwo && (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us something about yourself..."
              rows="4"
              className="p-3 rounded-md bg-white/10 border border-white/20 placeholder-white/70 text-white resize-none focus:outline-none focus:ring-2 focus:ring-white/30"
              required
            ></textarea>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-1 rounded-md bg-gradient-to-r from-purple-500 to-violet-700 hover:brightness-110 transition-all font-semibold"
          >
            {currState === 'Sign Up'
              ? isStepTwo
                ? 'Submit Bio'
                : 'Continue'
              : 'Login'}
          </button>

          {/* Policy Checkbox */}
          <label className="flex items-center gap-2 text-xs mt-2">
            <input type="checkbox" required className="accent-white" />
            <span className="text-white/80">
              I agree to the{' '}
              <span className="underline text-white">Terms & Policy</span>
            </span>
          </label>
        </form>

        {/* Footer Link */}
        <p className="text-xs text-center mt-6 text-white/70">
          {currState === 'Sign Up' ? (
            <>
              Already have an account?{' '}
              <span
                onClick={() => {
                  setCurrState('Login');
                  setIsStepTwo(false);
                }}
                className="text-white underline cursor-pointer"
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{' '}
              <span
                onClick={() => {
                  setCurrState('Sign Up');
                  setIsStepTwo(false);
                }}
                className="text-white underline cursor-pointer"
              >
                Sign Up
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
