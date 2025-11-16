import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Pill, Mail, Lock, User, ArrowRight, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { toast } from 'sonner@2.0.3';

interface SignupProps {
  onSignup: () => void;
}

export default function Signup({ onSignup }: SignupProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: '',
    reminderMethod: 'email',
    agreedToTerms: false
  });
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.contact) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!formData.agreedToTerms) {
      toast.error('Please agree to Terms & Conditions');
      return;
    }
    
    toast.success('Account created successfully! Welcome to MediTrack+');
    // Save name, email, and contact to localStorage
    localStorage.setItem('profileName', formData.fullName);
    localStorage.setItem('profileEmail', formData.email);
    localStorage.setItem('profileContact', formData.contact);
    onSignup();
    navigate('/login');
  };

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
            <img 
              src="/src/assets/download.png" 
              alt="MediTrack+ Logo" 
              className="w-16 h-16 rounded-2xl object-cover"
            />
          </div>

          <h2 className="text-center text-gray-900 mb-2">Create Account</h2>
          <p className="text-center text-gray-600 mb-8">Join MediTrack+ and stay healthy</p>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                />
              </div>
            </div>


            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="contact"
                  type="tel"
                  placeholder="Contact Number"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Remind me via</Label>
              <RadioGroup
                value={formData.reminderMethod}
                onValueChange={(value) => setFormData({ ...formData, reminderMethod: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email-reminder" />
                  <Label htmlFor="email-reminder" className="cursor-pointer">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sms" id="sms-reminder" />
                  <Label htmlFor="sms-reminder" className="cursor-pointer">SMS</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreedToTerms}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, agreedToTerms: checked as boolean })
                }
              />
              <Label htmlFor="terms" className="cursor-pointer leading-relaxed">
                I agree to{' '}
                <span className="text-[#3B82F6]">Terms & Conditions</span>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#3B82F6]/30 group"
            >
              Sign Up
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#3B82F6] hover:text-[#2563EB] transition-colors">
              Login instead
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
