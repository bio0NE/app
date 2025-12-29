import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2 } from 'lucide-react';

const AuthPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const autoNavRef = useRef(null);

  const [authMode, setAuthMode] = useState('signin');
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Auto redirect if user is already signed in
  useEffect(() => {
    const session = supabase.auth.getSession();
    session.then(res => {
      if (res.data.session && !autoNavRef.current) {
        autoNavRef.current = true;
        navigate('/dashboard', { replace: true });
      }
    });
  }, [navigate]);

  // === Email Sign-Up ===
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
      });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast({
        title: "Confirmation Email Sent!",
        description: "Please verify your email before signing in.",
      });
      setAuthMode('signin');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // === Email Sign-In ===
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "Login Successful", description: "Welcome back!" });
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error.message || "Invalid credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <>
      <Helmet>
        <title>{authMode === 'signin' ? 'Login' : 'Sign Up'} | Solid Security</title>
        <meta name="description" content="Secure your journey on Solana with Solid Security." />
      </Helmet>

      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-solana-black overflow-hidden relative">
        {/* Background gradient circles */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-solana-purple rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-solana-teal rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <img alt="Solid Security Logo" className="h-16 w-16 mx-auto mb-4" src="/logo.svg" />
            <h1 className="text-4xl font-bold text-white">
              {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-400">Secure your journey on Solana.</p>
          </div>

          <div className="p-8 rounded-2xl glassmorphism shadow-2xl">
            <AnimatePresence mode="wait">
              {authMode === 'signin' ? (
                <motion.form
                  key="signin"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleEmailSignIn}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email-signin" className="text-gray-300">Email</Label>
                    <Input
                      id="email-signin"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="bg-transparent border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signin" className="text-gray-300">Password</Label>
                    <Input
                      id="password-signin"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="bg-transparent border-gray-600 text-white"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-solana-purple hover:bg-solana-purple/90 font-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Mail className="w-5 h-5 mr-2" />}
                    Sign In
                  </Button>
                  <p className="text-sm text-center text-gray-400">
                    No account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="font-medium text-solana-teal hover:underline"
                    >
                      Sign Up
                    </button>
                  </p>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleEmailSignUp}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email-signup" className="text-gray-300">Email</Label>
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="bg-transparent border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup" className="text-gray-300">Password</Label>
                    <Input
                      id="password-signup"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="bg-transparent border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password-signup" className="text-gray-300">Confirm Password</Label>
                    <Input
                      id="confirm-password-signup"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      className="bg-transparent border-gray-600 text-white"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-solana-purple hover:bg-solana-purple/90 font-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Mail className="w-5 h-5 mr-2" />}
                    Sign Up
                  </Button>
                  <p className="text-sm text-center text-gray-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className="font-medium text-solana-teal hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-gray-400 hover:text-solana-teal transition-colors">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
