import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User, Phone, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useToast } from '../components/Toast';

export const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { success, error: toastError } = useToast();

  const isSignupParam = searchParams.get('mode') === 'signup';
  const [isSignup, setIsSignup] = useState(isSignupParam);

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignup) {
        if (!fullName.trim()) {
          toastError('Please enter your full name');
          setIsLoading(false);
          return;
        }
        await register(email, fullName, password, phone);
        success('Account created!', 'Welcome to QUICKBILL');
        navigate('/onboarding');
      } else {
        await login(email, password);
        success('Signed in successfully', 'Welcome back!');
        navigate('/app');
      }
    } catch (err: any) {
      toastError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async (demoEmail: string) => {
    setIsLoading(true);
    try {
      await login(demoEmail);
      success('Logged in as demo merchant', `Active session: ${demoEmail}`);
      navigate('/app');
    } catch (err: any) {
      toastError(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link to="/" className="inline-block">
          <Logo size="lg" showTagline={true} />
        </Link>
        <h2 className="mt-6 text-2xl font-extrabold text-[#0B1220] tracking-tight">
          {isSignup ? 'Create your merchant account' : 'Sign in to QUICKBILL'}
        </h2>
        <p className="mt-2 text-xs text-[#667085]">
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="font-bold text-[#4C7DFF] hover:underline"
          >
            {isSignup ? 'Sign in' : 'Start free trial'}
          </button>
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-[14px] border border-[#E4E7EC] shadow-[0_4px_18px_rgba(11,18,32,0.04)] space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <Input
                  label="Full Name *"
                  placeholder="e.g. Adaeze Nwosu"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  leftElement={<User className="w-4 h-4" />}
                  required
                />
                <Input
                  label="Phone Number"
                  placeholder="+234 803 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftElement={<Phone className="w-4 h-4" />}
                />
              </>
            )}

            <Input
              label="Business Email Address *"
              type="email"
              placeholder="hello@adaezefoods.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftElement={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password *"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftElement={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4 text-[#0B1220]" />}
            >
              {isSignup ? 'Create Account & Continue' : 'Sign In'}
            </Button>
          </form>

          {/* 1-Click Demo Accounts */}
          <div className="pt-4 border-t border-[#F2F4F7] space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085] block text-center">
              Or 1-Click Demo Sign In
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSignIn('hello@adaezefoods.ng')}
                className="py-2 px-3 rounded-[8px] border border-[#E4E7EC] hover:bg-[#F9FAFB] text-xs font-semibold text-[#0B1220] text-center"
              >
                Adaeze Foods Ltd
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn('owoadeopeyemi11@gmail.com')}
                className="py-2 px-3 rounded-[8px] border border-[#E4E7EC] hover:bg-[#F9FAFB] text-xs font-semibold text-[#0B1220] text-center"
              >
                Admin Reviewer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
