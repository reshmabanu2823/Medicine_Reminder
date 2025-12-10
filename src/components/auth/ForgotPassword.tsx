import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Pill, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setEmailSent(true);
      toast.success('Reset link sent! Check your email.');
    } else {
      toast.error('Please enter your email address');
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#B9E5C9]/30 via-white to-[#3B82F6]/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-[#B9E5C9] p-4 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-[#3B82F6]" />
              </div>
            </div>

            <h2 className="text-gray-900 mb-3">Check Your Email</h2>
            <p className="text-gray-600 mb-8">
              We've sent a password reset link to <br />
              <span className="text-[#3B82F6]">{email}</span>
            </p>

            <Link to="/login">
              <Button className="w-full h-12 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl transition-all">
                Back to Login
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B9E5C9]/30 via-white to-[#3B82F6]/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#B9E5C9] p-4 rounded-2xl">
              <Pill className="w-8 h-8 text-[#3B82F6]" />
            </div>
          </div>

          <h2 className="text-center text-gray-900 mb-2">Forgot Password?</h2>
          <p className="text-center text-gray-600 mb-8">
            No worries, we'll send you reset instructions
          </p>

          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#3B82F6]/30"
            >
              Send Reset Link
            </Button>
          </form>

          <Link
            to="/login"
            className="flex items-center justify-center mt-6 text-gray-600 hover:text-[#3B82F6] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
