
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Phone,
  Bell,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  Edit,
  UserPlus,
  Shield
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import BottomNav from './BottomNav';

interface ProfileProps {
  onLogout: () => void;
}

function Profile({ onLogout }: ProfileProps) {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
      name: localStorage.getItem('profileName') || 'Reshma',
      email: localStorage.getItem('profileEmail') || 'reshma@example.com',
      phone: localStorage.getItem('profileContact') || '+1 234 567 8900',
      reminderMethod: 'Email & Push Notifications'
    });

    // Keep profile data in sync with localStorage changes (e.g. after login/signup)
    useEffect(() => {
      setProfileData((prev) => ({
        ...prev,
        name: localStorage.getItem('profileName') || prev.name,
        email: localStorage.getItem('profileEmail') || prev.email,
        phone: localStorage.getItem('profileContact') || prev.phone,
      }));
    }, []);

    const handleLogout = () => {
      toast.success('Logged out successfully');
      onLogout();
      navigate('/login');
    };

    const menuItems = [
      {
        icon: Edit,
        label: 'Edit Profile',
        action: () => setIsEditing(!isEditing),
        color: 'text-[#3B82F6]'
      },
      {
        icon: Calendar,
        label: 'View Reminder History',
        action: () => navigate('/reports'),
        color: 'text-purple-600'
      },
      {
        icon: UserPlus,
        label: 'Connect with Caregiver',
        action: () => toast.info('Caregiver feature coming soon'),
        color: 'text-green-600'
      },
      {
        icon: Settings,
        label: 'Settings',
        action: () => navigate('/settings'),
        color: 'text-gray-600'
      },
    ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B9E5C9]/10 via-white to-[#3B82F6]/5 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white p-6 rounded-b-[2rem] shadow-lg">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="mb-1">Profile</h1>
          <p className="text-blue-100">Manage your account settings</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto p-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="w-20 h-20 border-4 border-[#B9E5C9]">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Reshma" />
              <AvatarFallback className="bg-[#B9E5C9] text-[#3B82F6] text-xl">R</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-gray-900 mb-1">{profileData.name}</h2>
                  <p className="text-gray-500">Patient</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="rounded-xl"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Mail className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-gray-500 text-xs mb-1">Email</p>
                <p className="text-gray-900">{profileData.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Phone className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-gray-500 text-xs mb-1">Phone</p>
                <p className="text-gray-900">{profileData.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Bell className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-gray-500 text-xs mb-1">Reminder Method</p>
                <p className="text-gray-900">{profileData.reminderMethod}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6"
        >
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-gray-50 ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <p className="text-gray-900">{item.label}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </motion.div>


        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-gradient-to-br from-[#3B82F6]/10 to-[#3B82F6]/5 rounded-2xl p-4 text-center">
            <p className="text-2xl text-[#3B82F6] mb-1">87%</p>
            <p className="text-gray-600 text-xs">Adherence Rate</p>
          </div>
          <div className="bg-gradient-to-br from-[#B9E5C9] to-[#A8D4B8] rounded-2xl p-4 text-center">
            <p className="text-2xl text-gray-900 mb-1">124</p>
            <p className="text-gray-600 text-xs">Doses Taken</p>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-4 text-center">
            <p className="text-2xl text-purple-600 mb-1">8</p>
            <p className="text-gray-600 text-xs">Active Meds</p>
          </div>
        </motion.div>

        {/* Medicine Intake History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-lg font-bold mb-2">Medicine Intake History</h2>
          {(() => {
            const history = JSON.parse(localStorage.getItem('intakeHistory') || '[]');
            if (!history.length) return <p className="text-gray-500">No medicine intake records yet.</p>;
            return (
              <ul className="space-y-2">
                {history.slice().reverse().map((rec: any, idx: number) => (
                  <li key={idx} className="bg-white rounded-xl p-3 shadow border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">{rec.name}</span>
                      <span className="text-xs text-gray-500">{new Date(rec.date).toLocaleString()}</span>
                    </div>
                    <div className="text-gray-600 text-sm">Time: {rec.time}</div>
                  </li>
                ))}
              </ul>
            );
          })()}
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                <AlertDialogDescription>
                  You'll need to login again to access your medicine reminders.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 rounded-xl"
                >
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100"
        >
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-gray-900 mb-1">Your data is secure</p>
              <p className="text-gray-600 text-xs">
                All your health information is encrypted and stored securely. We never share your data without your permission.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}

export default Profile;
