import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, HeartIcon } from '@heroicons/react/24/outline';
import { Button, Input, Card } from '../components/ui';

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginForm>>({});

  const handleChange = (field: keyof LoginForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm> = {};
    
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // On success, navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Image and Branding */}
      <div className="hidden lg:flex lg:w-1/2 wedding-gradient relative overflow-hidden">
        {/* Wedding Pattern Overlay */}
        <div className="absolute inset-0 wedding-pattern opacity-20"></div>
        
        {/* Content */}
        <div className="relative flex flex-col justify-center items-center p-12 text-center text-white">
          <div className="max-w-md space-y-6">
            {/* Logo/Brand */}
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-wedding-lg flex items-center justify-center">
                <HeartIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-header">VowCRM</h1>
                <p className="text-sm opacity-90">Wedding Mortgage Solutions</p>
              </div>
            </div>

            {/* Hero Image Placeholder */}
            <div className="w-full h-64 bg-white/10 rounded-wedding-lg flex items-center justify-center backdrop-blur-sm">
              <div className="text-center space-y-2">
                <div className="w-20 h-20 bg-white/20 rounded-full mx-auto flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold font-accent">Happy Couple</h3>
                <p className="text-sm opacity-80">Keys to Their New Home</p>
              </div>
            </div>

            {/* Hero Text */}
            <div className="space-y-3">
              <h2 className="text-3xl font-bold font-header">
                Welcome Back, Loan Officer
              </h2>
              <p className="text-lg opacity-90 font-body">
                Connect with couples at their most important moment and help them find their dream home.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-4 pt-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-rose-gold-300 rounded-full flex-shrink-0"></div>
                <span className="text-sm">Track wedding leads across platforms</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-rose-gold-300 rounded-full flex-shrink-0"></div>
                <span className="text-sm">Automated campaign management</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-rose-gold-300 rounded-full flex-shrink-0"></div>
                <span className="text-sm">Personalized couple experiences</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-warm-gray-50">
        <div className="w-full max-w-md">
          <Card variant="elevated" padding="lg">
            {/* Mobile Logo */}
            <div className="flex items-center justify-center space-x-3 mb-8 lg:hidden">
              <div className="w-10 h-10 bg-navy-900 rounded-wedding flex items-center justify-center">
                <HeartIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-header text-navy-900">VowCRM</h1>
                <p className="text-sm text-warm-gray-600">Wedding Mortgage Solutions</p>
              </div>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-navy-900 font-header">
                Sign In
              </h2>
              <p className="text-warm-gray-600 mt-2">
                Access your loan officer dashboard
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                error={errors.email}
                placeholder="Enter your email"
                leftIcon={
                  <svg className="w-5 h-5 text-warm-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                }
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')}
                error={errors.password}
                placeholder="Enter your password"
                leftIcon={
                  <svg className="w-5 h-5 text-warm-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-warm-gray-400 hover:text-warm-gray-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                }
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.rememberMe}
                    onChange={handleChange('rememberMe')}
                    className="w-4 h-4 text-navy-600 bg-warm-gray-100 border-warm-gray-300 rounded focus:ring-navy-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-warm-gray-600">
                    Remember me
                  </span>
                </label>

                <a
                  href="#"
                  className="text-sm text-navy-600 hover:text-navy-500 font-medium"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
              >
                Sign In
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-warm-gray-600">
                Don't have an account?{' '}
                <a
                  href="#"
                  className="font-medium text-rose-gold-600 hover:text-rose-gold-500"
                >
                  Contact your administrator
                </a>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-sage-50 rounded-wedding border border-sage-200">
              <p className="text-xs text-sage-700 font-medium mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-sage-600">
                <p>Email: demo@weddinglead.com</p>
                <p>Password: demo123</p>
              </div>
            </div>
          </Card>

          {/* Legal Footer */}
          <div className="mt-8 text-center text-xs text-warm-gray-500">
            <p>
              By signing in, you agree to our{' '}
              <a href="#" className="text-navy-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-navy-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;